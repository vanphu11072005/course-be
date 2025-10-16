import RoleService from "../services/role.service.js";
import BaseController from "./base.controller.js";

class RoleController extends BaseController {
  constructor() {
    super();
    this.service = new RoleService();
  }

  async getAllRoles(req, res) {
    const roles = await this.service.getAllRoles();
    res.json({ status: true, message: "Fetched roles successfully", data: roles });
  }

  async getRoleById(req, res) {
    const { id } = req.params;
    const role = await this.service.getRoleById(id);
    if (!role) return res.status(404).json({ status: false, message: "Role not found" });

    res.json({ status: true, message: "Fetched role successfully", data: role });
  }

  async createRole(req, res) {
    const roleData = req.body;
    const role = await this.service.createRole(roleData);
    res.status(201).json({ status: true, message: "Role created successfully", data: role });
  }

  async updateRole(req, res) {
    const { id } = req.params;
    const roleData = req.body;
    const role = await this.service.updateRole(id, roleData);

    if (!role) return res.status(404).json({ status: false, message: "Role not found" });

    res.json({ status: true, message: "Role updated successfully", data: role });
  }

  async deleteRole(req, res) {
    const { id } = req.params;
    const deleted = await this.service.deleteRole(id);

    if (!deleted) return res.status(404).json({ status: false, message: "Role not found" });

    res.json({ status: true, message: "Role deleted successfully" });
  }
}

export default new RoleController();
