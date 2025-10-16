import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";

class RoleRepository {
  constructor() {
    this.model = db.Role;
  }

  // Lấy danh sách role
  async getAllRoles() {
    return this.model.findAll({ order: [["createdAt", "DESC"]] });
  }

  // Lấy role theo id
  async getRoleById(id) {
    return this.model.findByPk(id);
  }

  // Tạo role mới
  async createRole(roleData) {
    return this.model.create({
      id: uuidv4(),
      name: roleData.name,
      description: roleData.description || null,
    });
  }

  // Cập nhật role
  async updateRole(id, roleData) {
    const role = await this.getRoleById(id);
    if (!role) return null;
    await role.update(roleData);
    return role;
  }

  // Xóa role
  async deleteRole(id) {
    const role = await this.getRoleById(id);
    if (!role) return false;
    await role.destroy();
    return true;
  }
}

export default RoleRepository;
