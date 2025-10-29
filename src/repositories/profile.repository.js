import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";

class ProfileRepository {
  constructor() {
    this.userModel = db.User;
    this.profileModel = db.Profile;
  }

  // Lấy profile của user theo id
  async getProfileByUserId(userId) {
    return this.userModel.findByPk(userId, {
      include: [
        {
          model: db.Profile,
          as: "profile",
          attributes: ["fullName", "phone", "address", "dateOfBirth"],
        },
        {
          model: db.Order, // ✅ join đúng quan hệ
          as: "orders",
          attributes: ["id", "status", "paymentStatus", "totalAmount"],
          include: [
            {
              model: db.OrderItem,
              as: "items",
              attributes: ["id", "finalPrice", "accessStatus", "createdAt"],
              where: { accessStatus: "active" },
              required: false,
              include: [
                {
                  model: db.Course,
                  as: "course",
                  attributes: ["id", "title", "price", "thumbnailUrl"],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  // Cập nhật profile (hoặc tạo nếu chưa có)
  async updateProfile(userId, data) {
    const user = await this.userModel.findByPk(userId, {
      include: [{ model: db.Profile, as: "profile" }],
    });

    if (!user) return null;

    // Update fields cơ bản user
    await user.update({
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      avatarUrl: data.avatarUrl ?? user.avatarUrl,
    });

    if (user.profile) {
      // Nếu đã có profile thì update
      await user.profile.update({
        fullName: data.name ?? user.Profile.fullName,
        phone: data.phone ?? user.Profile.phone,
        address: data.address ?? user.Profile.address,
        dateOfBirth: data.dob ?? user.Profile.dateOfBirth,
      });
    } else {
      // Nếu chưa có profile thì tạo mới
      await this.profileModel.create({
        id: uuidv4(),
        userId: user.id,
        fullName: data.name,
        phone: data.phone || null,
        address: data.address || null,
        dateOfBirth: data.dob || null,
      });
    }

    return this.getProfileByUserId(userId);
  }
}

export default ProfileRepository;