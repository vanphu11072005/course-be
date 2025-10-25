import DashboardRepository from "../repositories/dashboard.repository.js";

class DashboardService {
  constructor() {
    this.repository = new DashboardRepository();
  }

  getSummary() {
    return this.repository.getSummary();
  }

  getRevenueStats() {
    return this.repository.getRevenueStats();
  }

  getMonthlyNewUsers(lastMonths = 6) {
    console.log("📌 Service: lastMonths =", lastMonths);
    return this.repository.getMonthlyNewUsers(lastMonths);
  }

  getTopCourses(limit) {
    return this.repository.getTopCourses(limit);
  }

  getRecentOrders(limit) {
    return this.repository.getRecentOrders(limit);
  }

  getRecentReviews(limit) {
    return this.repository.getRecentReviews(limit);
  }
}

export default DashboardService;
