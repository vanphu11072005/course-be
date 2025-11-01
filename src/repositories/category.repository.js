import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op, Sequelize } from "sequelize";

class CategoryRepository {
  constructor() {
    this.model = db.Category;
    this.courseModel = db.Course;
  }

  // Lấy tất cả categories (có phân trang + search)
  async getAllCategories({
    page = 1,
    pageSize = 10,
    search,
    sortField = "createdAt",
    sortOrder = "desc",
  }) {
    const orderDir = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    const where = {};
    if (search) {
      where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
    }

    const orderArray = [];
    const directColumns = ["name", "status", "createdAt"];

    if (directColumns.includes(sortField)) {
      orderArray.push([sortField, orderDir]);
    } else if (sortField === "courseCount") {
      orderArray.push(Sequelize.literal(`COUNT(courses.id) ${orderDir}`));
    }

    const { count, rows } = await this.model.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: orderArray.length ? orderArray : [["createdAt", "DESC"]],
      include: [
        {
          model: this.courseModel,
          as: "courses",
          attributes: [],
          required: false,
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("courses.id")), "courseCount"],
        ],
      },
      group: ["Category.id"],
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

  // Lấy category theo ID
  async getCategoryById(id) {
    return this.model.findByPk(id);
  }

  // Tạo category mới
  async createCategory(categoryData) {
    return this.model.create({
      id: uuidv4(),
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || "",
      status: categoryData.status || "active",
    });
  }

  // Cập nhật category
  async updateCategory(id, data) {
    const category = await this.model.findByPk(id);
    if (!category) return null;

    await category.update({
      name: data.name ?? category.name,
      slug: data.slug ?? category.slug,
      description: data.description ?? category.description,
      status: data.status ?? category.status,
    });

    return category;
  }

  // Xóa category
  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    if (!category) return false;
    await category.destroy();
    return true;
  }
}

export default CategoryRepository;
