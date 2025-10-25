import ProfileRepository from "../repositories/profile.repository.js";

class ProfileService {
  constructor() {
    this.repository = new ProfileRepository();
  }

  // Lấy profile của user hiện tại
  async getProfile(userId) {
    return this.repository.getProfileByUserId(userId);
  }

  // Cập nhật profile user hiện tại
  async updateProfile(userId, data) {
    return this.repository.updateProfile(userId, data);
  }
}

export default new ProfileService();