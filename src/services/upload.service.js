import fs from "fs";

class UploadService {
  constructor() {}

  async upload(files) {
    try {
      return files.map((file) => `/uploads/${file.filename}`);
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  }
}

export default UploadService;
