import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op, Sequelize } from "sequelize";

class CourseRepository {
  constructor() {
    this.model = db.Course;
    this.enrollmentModel = db.Enrollment;
    this.paymentModel = db.Payment;
    this.categoryModel = db.Category;
    this.roleModel = db.Role;
  }

  // Lấy tất cả course (có phân trang + search + lọc category/instructor + sort)
  async getAllCourses({
    page = 1,
    pageSize = 10,
    search,
    category,
    instructor,
    sortField = "createdAt",
    sortOrder = "desc",
  }) {
    // Chuyển sortOrder sang chữ thường để Sequelize nhận
    const orderDir = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { "$instructor.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    if (category) where.category = category;
    if (instructor) where.instructor = instructor;

    // Xác định cột order
    const orderArray = [];
    const directColumns = ["title", "price", "status", "createdAt"];

    if (directColumns.includes(sortField)) {
      orderArray.push([sortField, orderDir]);
    } else if (sortField === "studentCount") {
      orderArray.push(Sequelize.literal(`COUNT(enrollments.id) ${orderDir}`));
    } else if (sortField === "instructor") {
      orderArray.push([{ model: db.User, as: "instructor" }, "name", orderDir]);
    } else if (sortField === "category") {
      orderArray.push([{ model: this.categoryModel, as: "category" }, "name", orderDir]);
    }

    const { count, rows } = await this.model.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: orderArray.length ? orderArray : [["createdAt", "DESC"]],
      include: [
        {
          model: this.enrollmentModel,
          as: "enrollments",
          attributes: [],
          required: false,
        },
        {
          model: this.categoryModel,
          as: "category",
          attributes: ["name"],
        },
        {
          model: db.User,
          as: "instructor",
          attributes: ["name"],
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("enrollments.id")), "studentCount"],
        ],
      },
      group: ["Course.id", "category.id", "instructor.id"],
      subQuery: false,
    });

    return {
      data: rows,
      pagination: {
        total: count.length ? count.length : count,
        page: +page,
        pageSize: +pageSize,
        totalPages: Math.ceil((count.length ? count.length : count) / pageSize),
      },
    };
  }

  async getCourseById(id) {
    return this.model.findByPk(id, {
      include: [
        {
          model: db.User,
          as: "instructor",
          attributes: ["id", "name"],
        },
        {
          model: this.categoryModel,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: db.Lesson,
          as: "lessons",
          attributes: ["id", "title"],
        },
        {
          model: this.enrollmentModel,
          as: "enrollments",
          attributes: [], // chỉ dùng để count student
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("enrollments.id")), "studentCount"],
        ],
      },
      group: ["Course.id", "category.id", "instructor.id", "lessons.id"],
      subQuery: false,
    });
  }

  async createCourse(courseData) {
    return this.model.create({
      id: uuidv4(),
      title: courseData.title,
      slug: courseData.slug,
      description: courseData.description,
      shortDescription: courseData.shortDescription,
      price: courseData.price,
      status: courseData.status || "draft",
      thumbnailUrl: courseData.thumbnailUrl,
      categoryId: courseData.categoryId,
      instructorId: courseData.instructorId,
    });
  }

  async updateCourse(id, data) {
    const course = await this.model.findByPk(id);
    if (!course) return null;

    await course.update({
      title: data.title ?? course.title,
      slug: data.slug ?? course.slug,
      description: data.description ?? course.description,
      shortDescription: data.shortDescription ?? course.shortDescription,
      price: data.price ?? course.price,
      status: data.status ?? course.status,
      thumbnailUrl: data.thumbnailUrl ?? course.thumbnailUrl,
      categoryId: data.categoryId ?? course.categoryId,
      instructorId: data.instructorId ?? course.instructorId,
    });

    return course;
  }

  async deleteCourse(id) {
    const course = await this.getCourseById(id);
    if (!course) return false;
    await course.destroy();
    return true;
  }

  // Instructor Dashboard
  async getInstructorCourses(instructorId) {
    return this.getAllCourses({ instructor: instructorId });
  }

  async getInstructorStudents(instructorId) {
    return this.enrollmentModel.findAll({
      where: { instructorId },
      include: [{ model: db.User, as: "student", attributes: ["id", "name", "email"] }],
    });
  }

  async getInstructorRevenue(instructorId) {
    const result = await this.paymentModel.findAll({
      where: { instructorId },
      attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "totalRevenue"]],
      raw: true,
    });
    return result[0]?.totalRevenue || 0;
  }
}

export default CourseRepository;
