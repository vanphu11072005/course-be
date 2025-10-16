import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op, Sequelize } from "sequelize";

class ReviewRepository {
  constructor() {
    this.model = db.Review;
    this.courseModel = db.Course;
    this.userModel = db.User;
  }

  // Lấy danh sách review (có phân trang + tìm kiếm + filter course/status + sort)
  async getAllReviews({
    page = 1,
    pageSize = 10,
    search,
    courseId,
    status,
    sortField = "createdAt",
    sortOrder = "desc",
  }) {
    const orderDir = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    const where = {};

    if (courseId) {
        if (Array.isArray(courseId)) {
        where.courseId = { [Op.in]: courseId };
        } else {
        where.courseId = courseId;
        }
    }

    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { "$user.name$": { [Op.like]: `%${search}%` } },
        { "$course.title$": { [Op.like]: `%${search}%` } },
      ];
    }

    const orderArray = [];
    const directColumns = ["rating", "status", "createdAt"];

    if (directColumns.includes(sortField)) {
      orderArray.push([sortField, orderDir]);
    } else if (sortField === "user") {
      orderArray.push([{ model: this.userModel, as: "user" }, "name", orderDir]);
    } else if (sortField === "course") {
      orderArray.push([{ model: this.courseModel, as: "course" }, "title", orderDir]);
    }

    const { count, rows } = await this.model.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: orderArray.length ? orderArray : [["createdAt", "DESC"]],
      include: [
        {
          model: this.userModel,
          as: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
        {
          model: this.courseModel,
          as: "course",
          attributes: ["id", "title"],
          required: false,
        },
      ],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: +page,
        pageSize: +pageSize,
        totalPages: Math.ceil((count.length ? count.length : count) / pageSize),
      },
    };
  }

  // Lấy review theo id
  async getReviewById(id) {
    return this.model.findByPk(id, {
      include: [
        { model: this.userModel, as: "user", attributes: ["id", "name", "email"] },
        { model: this.courseModel, as: "course", attributes: ["id", "title"] },
      ],
    });
  }

  // Tạo review
  async createReview(data) {
    return this.model.create({
      id: uuidv4(),
      userId: data.userId,
      courseId: data.courseId,
      rating: data.rating,
      comment: data.comment,
      status: data.status || "pending",
    });
  }

  // Cập nhật review
  async updateReview(id, data) {
    const review = await this.model.findByPk(id);
    if (!review) return null;

    await review.update({
      rating: data.rating ?? review.rating,
      comment: data.comment ?? review.comment,
      status: data.status ?? review.status,
    });

    return review;
  }

  // Xóa review
  async deleteReview(id) {
    const review = await this.getReviewById(id);
    if (!review) return false;
    await review.destroy();
    return true;
  }

  // Duyệt review
  async approveReview(id) {
    const review = await this.getReviewById(id);
    if (!review) return null;
    await review.update({ status: "approved" });
    return review;
  }

  // Instructor Dashboard
  async getInstructorReviews(instructorId) {
    // Lấy review của tất cả courses do instructor này dạy
    const courses = await this.courseModel.findAll({
      where: { instructorId },
      attributes: ["id"],
    });

    const courseIds = courses.map((c) => c.id);

    return this.getAllReviews({ courseId: courseIds });
  }

  async getInstructorReviewStats(instructorId) {
    const courses = await this.courseModel.findAll({
      where: { instructorId },
      attributes: ["id"],
    });

    const courseIds = courses.map((c) => c.id);

    const stats = await this.model.findAll({
      where: { courseId: { [Op.in]: courseIds } },
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Chuyển về object { pending: 3, approved: 5, rejected: 1 }
    const result = { pending: 0, approved: 0, rejected: 0 };
    stats.forEach((s) => {
      result[s.status] = parseInt(s.count, 10);
    });

    return result;
  }
}

export default ReviewRepository;
