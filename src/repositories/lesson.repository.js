import db from "../database/models/index.js";

class LessonRepository {
  constructor() {
    this.model = db.Lesson;
  }

  async findAll({ page = 1, pageSize = 10, courseId }) {
    const offset = (page - 1) * pageSize;
    const where = {};

    if (courseId) where.courseId = courseId;

    const { count, rows } = await this.model.findAndCountAll({
      where,
      offset,
      limit: parseInt(pageSize),
      order: [["position", "ASC"]],
      include: [
        {
          model: db.Course,
          as: "course",
          attributes: ["id", "title"],
        },
      ],
    });

    return { count, rows };
  }

  async findById(id) {
    return await this.model.findByPk(id, {
      include: [
        {
          model: db.Course,
          as: "course",
          attributes: ["id", "title"],
        },
      ],
    });
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const lesson = await this.model.findByPk(id);
    if (!lesson) return null;
    await lesson.update(data);
    return lesson;
  }

  async delete(id) {
    const lesson = await this.model.findByPk(id);
    if (!lesson) return null;
    await lesson.destroy();
    return true;
  }
}

export default LessonRepository;
