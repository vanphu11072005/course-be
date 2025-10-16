// import BaseController from "./base.controller.js";
// import TagsService from "../services/tags.service.js";

// class TagsController extends BaseController {
//   constructor() {
//     super();
//     this.service = new TagsService();
//   }

//   async getAllTags(req, res) {
//     try {
//       const tags = await this.service.getAllTags(req);
//       res.json(tags);
//     } catch (error) {
//       console.error("Error fetching tags:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }

//   async getTagById(req, res) {
//     try {
//       const { id } = req.params;
//       const tag = await this.service.getTagById(id);
//       res.json(tag);
//     } catch (error) {
//       console.error("Error fetching tag:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }

//   async createTag(req, res) {
//     try {
//       const data = req.body;
//       await this.service.createTag(data);
//       return res.status(200).json({ status: true });
//     } catch (error) {
//       console.error("Error creating tag:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }

//   async editTag(req, res) {
//     try {
//       const { id } = req.params;
//       const data = req.body;
//       await this.service.editTag(id, data);
//       return res.status(200).json({ status: true });
//     } catch (error) {
//       console.error("Error creating tag:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }

//   async deleteTag(req, res) {
//     try {
//       const { id } = req.params;
//       await this.service.deleteTag(id);
//       return res.status(200).json({ status: true });
//     } catch (error) {
//       console.error("Error dalete tag:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// }

// export default TagsController;
