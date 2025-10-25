import SystemRepository from "../repositories/system.repository.js";

class SystemService {
  constructor() {
    this.repository = new SystemRepository();
  }

  async getSystemStatus() {
    console.log("🔧 [Service] Lấy trạng thái hệ thống");
    const result = await this.repository.getSystemStatus();
    return result;
  }

  async updateSystemStatus(payload) {
    console.log("🔧 [Service] Cập nhật cấu hình:", payload);
    const updated = await this.repository.updateSystemStatus(payload);
    return updated;
  }
}

export default SystemService;
