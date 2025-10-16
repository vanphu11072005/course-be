import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

class CouponRepository {
  constructor() {
    this.model = db.Coupon;
    this.orderModel = db.Order;
  }

  // Lấy tất cả coupon (có phân trang + search + lọc status + sort)
  async getAllCoupons({
    page = 1,
    pageSize = 10,
    search,
    status,
    sortField = "createdAt",
    sortOrder = "desc",
  }) {
    const orderDir = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    const where = {};
    if (search) {
      where.code = { [Op.like]: `%${search}%` };
    }
    if (status) {
      where.status = status;
    }

    const orderArray = [];
    const directColumns = ["code", "value", "status", "createdAt"];
    if (directColumns.includes(sortField)) {
      orderArray.push([sortField, orderDir]);
    }

    const { count, rows } = await this.model.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: orderArray.length ? orderArray : [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: +page,
        pageSize: +pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }

  async getCouponById(id) {
    return this.model.findByPk(id);
  }

  async createCoupon(couponData) {
    return this.model.create({
      id: uuidv4(),
      code: couponData.code,
      description: couponData.description,
      discountType: couponData.discountType,
      value: couponData.value,
      usageCount: couponData.usageCount || 0,
      maxUsage: couponData.maxUsage || 0,
      validFrom: couponData.validFrom,
      validTo: couponData.validTo,
      minOrderValue: couponData.minOrderValue || 0,
      status: couponData.status || "active",
    });
  }

  async updateCoupon(id, data) {
    const coupon = await this.model.findByPk(id);
    if (!coupon) return null;

    await coupon.update({
      code: data.code ?? coupon.code,
      description: data.description ?? coupon.description,
      discountType: data.discountType ?? coupon.discountType,
      value: data.value ?? coupon.value,
      usageCount: data.usageCount ?? coupon.usageCount,
      maxUsage: data.maxUsage ?? coupon.maxUsage,
      validFrom: data.validFrom ?? coupon.validFrom,
      validTo: data.validTo ?? coupon.validTo,
      minOrderValue: data.minOrderValue ?? coupon.minOrderValue,
      status: data.status ?? coupon.status,
    });

    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await this.getCouponById(id);
    if (!coupon) return false;
    await coupon.destroy();
    return true;
  }
}

export default CouponRepository;
