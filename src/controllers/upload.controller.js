// import UploadService from "../services/upload.service.js";
// import BaseController from "./base.controller.js";

// export default class UploadController extends BaseController {
//   constructor() {
//     super();
//     this.service = new UploadService();
//   }

//   async upload(req, res) {
//     try {
//       if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ error: "No files uploaded" });
//       }
//       const urls = await this.service.upload(req.files);
//       res.json({ urls });
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// }
