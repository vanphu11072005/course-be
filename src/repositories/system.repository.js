class SystemRepository {
  constructor() {
    // Dữ liệu mô phỏng - có thể thay bằng DB
    this.systemConfig = {
      maintenanceMode: false,
      language: "vi",
      theme: "light",
    };
  }

  async getSystemStatus() {
    console.log("🧩 [Repository] Lấy systemConfig:", this.systemConfig);
    return this.systemConfig;
  }

  async updateSystemStatus(data) {
    console.log("🧩 [Repository] Cập nhật systemConfig:", data);
    this.systemConfig = { ...this.systemConfig, ...data };
    return this.systemConfig;
  }
}

export default SystemRepository;
