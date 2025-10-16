import LessonService from "../services/lesson.service.js";

class LessonController {
  constructor() {
    this.service = new LessonService();
  }

  getLessons = async (req, res) => {
    try {
      const { page, pageSize, courseId } = req.query;
      const result = await this.service.getAll({ page, pageSize, courseId });
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getLessonById = async (req, res) => {
    try {
      const lesson = await this.service.getById(req.params.id);
      res.json(lesson);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  createLesson = async (req, res) => {
    try {
      const data = req.body;
      const lesson = await this.service.create(data);
      res.status(201).json(lesson);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  updateLesson = async (req, res) => {
    try {
      const lesson = await this.service.update(req.params.id, req.body);
      res.json(lesson);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteLesson = async (req, res) => {
    try {
      const result = await this.service.delete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

export default new LessonController();
