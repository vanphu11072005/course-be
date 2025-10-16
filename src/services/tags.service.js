// import TagsRepository from "../repositories/tags.repository.js";

// class TagsService {
//   constructor() {
//     this.repository = new TagsRepository();
//   }

//   async getAllTags(req) {
//     try {
//       return await this.repository.getAllTags(req);
//     } catch (error) {
//       throw new Error("Error fetching tags: " + error.message);
//     }
//   }
//   async getTagById(id) {
//     try {
//       return await this.repository.getTagById(id);
//     } catch (error) {
//       throw new Error("Error fetching tag: " + error.message);
//     }
//   }

//   async createTag(data) {
//     try {
//       return await this.repository.createTag(data);
//     } catch (error) {
//       throw new Error("Error creating product: " + error.message);
//     }
//   }

//   async editTag(id, data) {
//     try {
//       return await this.repository.editTag(id, data);
//     } catch (error) {
//       throw new Error("Error updating tag: " + error.message);
//     }
//   }

//   async deleteTag(id) {
//     try {
//       return await this.repository.deleteTag(id);
//     } catch (error) {
//       throw new Error("Error deleting tag: " + error.message);
//     }
//   }
// }

// export default TagsService;
