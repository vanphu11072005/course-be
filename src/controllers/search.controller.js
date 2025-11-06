import SearchService from "../services/search.service.js";
import BaseController from "./base.controller.js";

class SearchController extends BaseController {
  constructor() {
    super();
    this.service = new SearchService();
  }

  async searchAll(req, res) {
    const { query } = req.query;
    try {
      const results = await this.service.searchAll(query);
      res.json(results);
    } catch (error) {
      console.error("❌ [Controller] Lỗi search:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi tìm kiếm",
      error: error.message,
      stack: error.stack,
    });
    }
  }
}

export default new SearchController();