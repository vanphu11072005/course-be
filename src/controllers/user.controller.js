import UserService from "../services/user.service.js";
import BaseController from "./base.controller.js";

class UserController extends BaseController {
  constructor() {
    super();
    this.service = new UserService();
  }

  // Lấy danh sách users (có phân trang, search, lọc role)
  async getListUsers(req, res) {
    const {
      page = 1,
      pageSize = 10, 
      role, 
      search,
      sortField,
      sortOrder,
    } = req.query;

    const result = await this.service.getListUsers({ 
      page, 
      pageSize, 
      role, 
      search,
      sortField,
      sortOrder,
    });

    res.json({
      status: true,
      message: "Fetched users successfully",
      data: result.data,
      pagination: result.pagination,
    });
  }

  // Lấy user theo id
  async getUserById(req, res) {
    const { id } = req.params;
    const user = await this.service.getUserById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({
      status: true,
      message: "Fetched user successfully",
      data: user,
    });
  }

  // Tạo user mới
  async createUser(req, res) {
    const data = req.body;
    
    if (req.file) {
      data.avatarUrl = `/uploads/${req.file.filename}`;
    } else {
      data.avatarUrl = "/uploads/default-avatar.jpg";
    }

    if (typeof data.profile === "string") {
      try {
        data.profile = JSON.parse(data.profile);
      } catch {
        data.profile = null;
      }
    }
    
    const newUser = await this.service.createUser(data);
    
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: newUser,
    });
  }

  // Cập nhật user
  async updateUser(req, res) {
    const { id } = req.params;
    const data = req.body;

    if (req.file) {
      data.avatarUrl = `/uploads/${req.file.filename}`;
    }
    
    if (typeof data.profile === "string") {
      try {
        data.profile = JSON.parse(data.profile);
      } catch {
        data.profile = null;
      }
    }
    
    const updatedUser = await this.service.updateUser(id, data);

    if (!updatedUser) {
      return res
      .status(404)
      .json({ status: false, message: "User not found" });
    }

    res.json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }

  // Xóa user (soft delete/block)
  async deleteUser(req, res) {
    const { id } = req.params;
    const deleted = await this.service.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({
      status: true,
      message: "User deleted successfully",
    });
  }
}

export default new UserController;