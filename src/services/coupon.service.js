import CouponRepository from "../repositories/coupon.repository.js";

class CouponService {
  constructor() {
    this.repository = new CouponRepository();
  }

  // Lấy danh sách coupons
  getListCoupons({ page, pageSize, search, status, sortField, sortOrder }) {
    return this.repository.getAllCoupons({ page, pageSize, search, status, sortField, sortOrder });
  }

  // Lấy coupon theo id
  getCouponById(id) {
    return this.repository.getCouponById(id);
  }

  // Tạo coupon
  createCoupon(data) {
    return this.repository.createCoupon(data);
  }

  // Cập nhật coupon
  updateCoupon(id, data) {
    return this.repository.updateCoupon(id, data);
  }

  // Xóa coupon
  deleteCoupon(id) {
    return this.repository.deleteCoupon(id);
  }
}

export default CouponService;
