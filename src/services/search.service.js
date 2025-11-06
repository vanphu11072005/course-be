import SearchRepository from "../repositories/search.repository.js";

class SearchService {
  constructor() {
    this.repository = new SearchRepository();
  }

  async searchAll(query) {
    const results = await this.repository.searchAll(query);
    return results;
  }
}

export default SearchService;
