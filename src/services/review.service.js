import ReviewRepository from "../repositories/review.repository.js";

class ReviewService {
  constructor() {
    this.repository = new ReviewRepository();
  }

  // Lấy danh sách review (có phân trang, tìm kiếm, sắp xếp, filter trạng thái)
  getListReviews({ page, pageSize, search, courseId, status, sortField, sortOrder }) {
    return this.repository.getAllReviews({ page, pageSize, search, courseId, status, sortField, sortOrder });
  }

  // Lấy review theo id
  getReviewById(id) {
    return this.repository.getReviewById(id);
  }

  // Tạo review
  createReview(data) {
    return this.repository.createReview(data);
  }

  // Cập nhật review
  updateReview(id, data) {
    return this.repository.updateReview(id, data);
  }

  // Xóa review
  deleteReview(id) {
    return this.repository.deleteReview(id);
  }

  // Duyệt review (thay đổi status thành "approved")
  approveReview(id) {
    return this.repository.approveReview(id);
  }

  // ========== Instructor Dashboard ==========
  // Lấy tất cả review của khóa học của giảng viên
  getInstructorReviews(instructorId) {
    return this.repository.getInstructorReviews(instructorId);
  }

  // Thống kê số review theo status
  getInstructorReviewStats(instructorId) {
    return this.repository.getInstructorReviewStats(instructorId);
  }
}

export default ReviewService;
