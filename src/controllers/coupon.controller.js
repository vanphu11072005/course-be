import CouponService from "../services/coupon.service.js";
import BaseController from "./base.controller.js";

class CouponController extends BaseController {
  constructor() {
    super();
    this.service = new CouponService();
  }

  // Lấy danh sách coupons
  async getAllCoupons(req, res) {
    const {
      page = 1,
      pageSize = 10,
      search,
      status,
      sortField,
      sortOrder,
    } = req.query;

    const result = await this.service.getListCoupons({
      page,
      pageSize,
      search,
      status,
      sortField,
      sortOrder,
    });

    res.json({
      status: true,
      message: "Fetched coupons successfully",
      data: result.data,
      pagination: result.pagination,
    });
  }

  // Lấy coupon theo id
  async getCouponById(req, res) {
    const { id } = req.params;
    const coupon = await this.service.getCouponById(id);

    if (!coupon) {
      return res.status(404).json({ status: false, message: "Coupon not found" });
    }

    res.json({
      status: true,
      message: "Fetched coupon successfully",
      data: coupon,
    });
  }

  // Tạo coupon mới
  async createCoupon(req, res) {
    const data = req.body;
    const newCoupon = await this.service.createCoupon(data);

    res.status(201).json({
      status: true,
      message: "Coupon created successfully",
      data: newCoupon,
    });
  }

  // Cập nhật coupon
  async updateCoupon(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updatedCoupon = await this.service.updateCoupon(id, data);

    if (!updatedCoupon) {
      return res.status(404).json({ status: false, message: "Coupon not found" });
    }

    res.status(200).json({
      status: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  }

  // Xóa coupon
  async deleteCoupon(req, res) {
    const { id } = req.params;
    const deleted = await this.service.deleteCoupon(id);

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Coupon not found" });
    }

    res.json({
      status: true,
      message: "Coupon deleted successfully",
    });
  }
}

export default new CouponController();
