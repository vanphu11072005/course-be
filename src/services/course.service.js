import CourseRepository from "../repositories/course.repository.js";

class CourseService {
  constructor() {
    this.repository = new CourseRepository();
  }

  // Lấy danh sách courses
  getListCourses({ page, pageSize, search, category, instructor, sortField, sortOrder }) {
    return this.repository.getAllCourses({ page, pageSize, search, category, instructor, sortField, sortOrder });
  }

  // Lấy course theo id
  getCourseById(id) {
    return this.repository.getCourseById(id);
  }

  // Tạo course
  createCourse(data) {
    return this.repository.createCourse(data);
  }

  // Cập nhật course
  updateCourse(id, data) {
    return this.repository.updateCourse(id, data);
  }

  // Xóa course
  deleteCourse(id) {
    return this.repository.deleteCourse(id);
  }

  // ========== Instructor Dashboard ==========
  getInstructorCourses(instructorId) {
    return this.repository.getInstructorCourses(instructorId);
  }

  getInstructorStudents(instructorId) {
    return this.repository.getInstructorStudents(instructorId);
  }

  getInstructorRevenue(instructorId) {
    return this.repository.getInstructorRevenue(instructorId);
  }
}

export default CourseService;
