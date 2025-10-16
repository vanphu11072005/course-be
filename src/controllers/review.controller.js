import ReviewService from "../services/review.service.js";
import BaseController from "./base.controller.js";

class ReviewController extends BaseController {
  constructor() {
    super();
    this.service = new ReviewService();
  }

  // Lấy danh sách review
  async getAllReviews(req, res) {
    const {
      page = 1,
      pageSize = 10,
      search,
      courseId,
      status,
      sortField,
      sortOrder,
    } = req.query;

    const result = await this.service.getListReviews({
      page,
      pageSize,
      search,
      courseId,
      status,
      sortField,
      sortOrder,
    });

    res.json({
      status: true,
      message: "Fetched reviews successfully",
      data: result.data,
      pagination: result.pagination,
    });
  }

  // Lấy review theo id
  async getReviewById(req, res) {
    const { id } = req.params;
    const review = await this.service.getReviewById(id);

    if (!review) {
      return res.status(404).json({ status: false, message: "Review not found" });
    }

    res.json({
      status: true,
      message: "Fetched review successfully",
      data: review,
    });
  }

  // Tạo review mới
  async createReview(req, res) {
    const data = req.body;
    const newReview = await this.service.createReview(data);

    res.status(201).json({
      status: true,
      message: "Review created successfully",
      data: newReview,
    });
  }

  // Cập nhật review
  async updateReview(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updatedReview = await this.service.updateReview(id, data);

    if (!updatedReview) {
      return res
        .status(404)
        .json({ status: false, message: "Review not found" });
    }

    res.status(200).json({
      status: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  }

  // Xóa review
  async deleteReview(req, res) {
    const { id } = req.params;
    const deleted = await this.service.deleteReview(id);

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Review not found" });
    }

    res.json({
      status: true,
      message: "Review deleted successfully",
    });
  }

  // Duyệt review
  async approveReview(req, res) {
    const { id } = req.params;
    const approvedReview = await this.service.approveReview(id);

    if (!approvedReview) {
      return res.status(404).json({ status: false, message: "Review not found" });
    }

    res.json({
      status: true,
      message: "Review approved successfully",
      data: approvedReview,
    });
  }

  // ========== Instructor Dashboard ==========

  // Lấy tất cả review của khóa học giảng viên
  async getInstructorReviews(req, res) {
    const instructorId = req.user.id;
    const result = await this.service.getInstructorReviews(instructorId);

    res.json({
      status: true,
      message: "Fetched instructor reviews successfully",
      data: result.data,
      pagination: result.pagination,
    });
  }

  // Thống kê review theo status
  async getInstructorReviewStats(req, res) {
    const instructorId = req.user.id;
    const stats = await this.service.getInstructorReviewStats(instructorId);

    res.json({
      status: true,
      message: "Fetched instructor review stats successfully",
      data: stats,
    });
  }
}

export default new ReviewController();
