import SearchService from "../services/search.service.js";
import BaseController from "./base.controller.js";

class SearchController extends BaseController {
  constructor() {
    super();
    this.service = new SearchService();
  }

  async searchAll(req, res) {
    console.log("🔍 [Controller] Query nhận từ URL:", req.query.query); // log query nhận
    const { query } = req.query;
    try {
      const results = await this.service.searchAll(query);
      console.log("📥 [Controller] Kết quả search trả về:", results); // log kết quả
      res.json(results);
    } catch (error) {
      console.error("❌ [Controller] Lỗi search:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi tìm kiếm",
      error: error.message,
      stack: error.stack, // thêm dòng này để xem lỗi chi tiết trong terminal
    });
    }
  }
}

export default new SearchController();
