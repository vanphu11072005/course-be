import SearchRepository from "../repositories/search.repository.js";

class SearchService {
  constructor() {
    this.repository = new SearchRepository();
  }

  async searchAll(query) {
    console.log("🔧 [Service] Nhận query:", query); // log query từ controller
    const results = await this.repository.searchAll(query);
    console.log("🔧 [Service] Kết quả nhận từ repository:", results); // log kết quả repo
    return results;
  }
}

export default SearchService;
