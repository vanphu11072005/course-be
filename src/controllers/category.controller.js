import CategoryService from "../services/category.service.js";
import BaseController from "./base.controller.js";
import slugify from "slugify";

class CategoryController extends BaseController {
  constructor() {
    super();
    this.service = new CategoryService();
  }

  // Lấy danh sách categories
  async getAllCategories(req, res) {
    const { 
      page = 1, 
      pageSize = 10, 
      search,
      sortField, 
      sortOrder,
    } = req.query;

    const result = await this.service.getListCategories({ 
      page, 
      pageSize, 
      search,
      sortField, 
      sortOrder,
    });

    res.json({
      status: true,
      message: "Fetched categories successfully",
      data: result.data,
      pagination: result.pagination,
    });
  }

  // Lấy category theo id
  async getCategoryById(req, res) {
    const { id } = req.params;
    const category = await this.service.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    res.json({
      status: true,
      message: "Fetched category successfully",
      data: category,
    });
  }

  // Tạo category mới
  async createCategory(req, res) {
    const data = req.body;
    
    if (!data.slug && data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }
    
    const newCategory = await this.service.createCategory(data);
    
    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: newCategory,
    });
  }

  // Cập nhật category
  async updateCategory(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updated = await this.service.updateCategory(id, data);

    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }

    if (!updated) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    res.json({
      status: true,
      message: "Category updated successfully",
      data: updated,
    });
  }

  // Xóa category
  async deleteCategory(req, res) {
    const { id } = req.params;
    const deleted = await this.service.deleteCategory(id);

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    res.json({
      status: true,
      message: "Category deleted successfully",
    });
  }
}

export default new CategoryController();