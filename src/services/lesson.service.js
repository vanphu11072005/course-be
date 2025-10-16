import LessonRepository from "../repositories/lesson.repository.js";

class LessonService {
  constructor() {
    this.repo = new LessonRepository();
  }

  async getAll({ page, pageSize, courseId }) {
    const { count, rows } = await this.repo.findAll({
      page,
      pageSize,
      courseId,
    });
    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    };
  }

  async getById(id) {
    const lesson = await this.repo.findById(id);
    if (!lesson) throw new Error("Lesson not found");
    return lesson;
  }

  async create(data) {
    return await this.repo.create(data);
  }

  async update(id, data) {
    const updated = await this.repo.update(id, data);
    if (!updated) throw new Error("Lesson not found");
    return updated;
  }

  async delete(id) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new Error("Lesson not found");
    return { message: "Lesson deleted successfully" };
  }
}

export default LessonService;
