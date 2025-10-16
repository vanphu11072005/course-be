import RoleRepository from "../repositories/role.repository.js";

class RoleService {
  constructor() {
    this.repository = new RoleRepository();
  }

  getAllRoles() {
    return this.repository.getAllRoles();
  }

  getRoleById(id) {
    return this.repository.getRoleById(id);
  }

  createRole(roleData) {
    return this.repository.createRole(roleData);
  }

  updateRole(id, roleData) {
    return this.repository.updateRole(id, roleData);
  }

  deleteRole(id) {
    return this.repository.deleteRole(id);
  }
}

export default RoleService;
