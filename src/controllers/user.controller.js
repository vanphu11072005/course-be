import UserService from "../services/user.service.js";
import BaseController from "./base.controller.js";
import slugify from "slugify";

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
    const newUser = await this.service.createUser(data);

    if (typeof data.profile === "string") {
      try {
        data.profile = JSON.parse(data.profile);
      } catch {
        data.profile = null;
      }
    }

    if (req.file) {
      data.avatarUrl = `/uploads/${req.file.filename}`;
    } else {
      data.avatarUrl = "/uploads/default-avatar.jpg";
    }


    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: newUser,
    });
  }

  // Cập nhật user
  async updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await this.service.updateUser(id, userData);

    if (typeof data.profile === "string") {
      try {
        data.profile = JSON.parse(data.profile);
      } catch {
        data.profile = null;
      }
    }

    if (req.file) {
      data.avatarlUrl = `/uploads/${req.file.filename}`;
    }

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