import UserRepository from "../repositories/user.repository.js";
import { hashPassword } from "../helpers/hash.helper.js";

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  // Lấy danh sách users
  getListUsers({ page, pageSize, role, search, sortField, sortOrder }) {
    return this.repository.getAllUsers({ page, pageSize, role, search, sortField, sortOrder });
  }

  // Lấy user theo id
  getUserById(id, includeRefreshToken = false) {
    return this.repository.getUserById(id, includeRefreshToken);
  }

  // Tạo user mới (hash password trước khi lưu)
  async createUser(data) {
    if (!data.password) {
      throw new Error("Password is required");
    }
    if (!data.roleId) {
      throw new Error("roleId is required");
    }

    if (data.profile && typeof data.profile === "string") {
      try {
        data.profile = JSON.parse(data.profile);
      } catch {
        console.warn("Profile parse failed, ignoring");
        data.profile = null;
      }
    }

    data.passwordHash = await hashPassword(data.password);
    delete data.password;

    return this.repository.createUser(data);
  }

  // Cập nhật user
  async updateUser(id, data) {
    if (data.password) {
      data.passwordHash = await hashPassword(data.password);
      delete data.password;
    }

    if (data.profile && typeof data.profile === "string") {
      try {
        data.profile = JSON.parse(data.profile);
      } catch {
        console.warn("Profile parse failed, ignoring");
        data.profile = null;
      }
    }

    return this.repository.updateUser(id, data);
  }

  // Xóa user
  deleteUser(id) {
    return this.repository.deleteUser(id);
  }

  // Lấy user theo email
  getUserByEmail(email, withPassword = false) {
    return this.repository.getUserByEmail(email, withPassword);
  }
}

export default UserService;
