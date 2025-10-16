import CategoryRepository from "../repositories/category.repository.js";

class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  // Lấy danh sách categories
  getListCategories({ page, pageSize, search, sortField, sortOrder }) {
    return this.repository.getAllCategories({ page, pageSize, search, sortField, sortOrder });
  }

  // Lấy category theo id
  getCategoryById(id) {
    return this.repository.getCategoryById(id);
  }

  // Tạo category
  createCategory(data) {
    return this.repository.createCategory(data);
  }

  // Cập nhật category
  updateCategory(id, data) {
    return this.repository.updateCategory(id, data);
  }

  // Xóa category
  deleteCategory(id) {
    return this.repository.deleteCategory(id);
  }
}

export default CategoryService;
