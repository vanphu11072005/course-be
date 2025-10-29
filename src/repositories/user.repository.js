import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";
import { getExpiresAtFromToken } from "../helpers/jwt.helper.js";
import { Op } from "sequelize";

class UserRepository {
  constructor() {
    this.model = db.User;
  }

  // Lấy danh sách users (có phân trang, search, filter role)
  async getAllUsers({ 
    page = 1, 
    pageSize = 10, 
    role, 
    search,
    sortField = "createdAt",
    sortOrder = "desc",
  }) {
    const orderDir = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { "$profile.phone$": { [Op.like]: `%${search}%` } },
        { "$profile.dateOfBirth$": { [Op.like]: `%${search}%` } },
      ];
    }

    const orderArray = [];
    const directColumns = ["name", "email", "status", "createdAt"];

    if (directColumns.includes(sortField)) {
      orderArray.push([sortField, orderDir]);
    } else if (sortField === "dateOfBirth") {
      orderArray.push([{ model: db.Profile, as: "profile" }, "dateOfBirth", orderDir]);
    } else if (["fullName"].includes(sortField)) {
      orderArray.push([{ model: db.Profile, as: "profile" }, sortField, orderDir]);
    }

    const include = [
      { model: db.Role, as: "role" },
      { model: db.Profile, as: "profile", attributes: ["fullName", "phone", "address", "dateOfBirth"] },
    ];

    if (role) {
      include[0].where = { name: role };
    }

    const { count, rows } = await this.model.findAndCountAll({
      where,
      include,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      order: orderArray.length ? orderArray : [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      pagination: {
        total: count.length ? count.length : count,
        page: +page,
        limit: +pageSize,
        totalPages: Math.ceil((count.length ? count.length : count) / pageSize),
      },
    };
  }

  // Lấy user theo id
  async getUserById(id, includeRefreshToken = false) {
    const include = [
      { model: db.Role, as: "role" },
      {
        model: db.Profile,
        as: "profile",
        attributes: ["fullName", "phone", "address", "dateOfBirth"],
      },
      {
        model: db.Enrollment,
        as: "enrollments",
        include: [
          {
            model: db.Course,
            as: "course",
            attributes: ["id", "title"],
          },
        ],
      },
    ];

    if (includeRefreshToken)
      include.push({ model: db.RefreshToken, as: "refreshToken" });

    return this.model.findByPk(id, { include });
  }

  // Tạo user
  async createUser(userData) {
    const newUser = await this.model.create({
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash,
      roleId: userData.roleId || null,
      avatarUrl: userData.avatarUrl,
      status: userData.status || "active",
    });

    // ✅ Nếu có profile => tạo kèm
    if (userData.profile) {
      await db.Profile.create({
        id: uuidv4(),
        userId: newUser.id,
        fullName: userData.profile.fullName,
        phone: userData.profile.phone || null,
        address: userData.profile.address || null,
        dateOfBirth: userData.profile.dateOfBirth || null,
      });
    }

    // Lấy lại user có include role + profile
    return this.getUserById(newUser.id);
  }

  // Cập nhật user
  async updateUser(id, userData) {
    const user = await this.model.findByPk(id, {
      include: [{ model: db.Profile, as: "profile" }],
    });

    if (!user) return null;

    // Xử lý password nếu có
    if (userData.password) {
      userData.passwordHash = await hashPassword(userData.password);
      delete userData.password;
    }

    // Update fields cơ bản của User
    await user.update({
      name: userData.name ?? user.name,
      email: userData.email ?? user.email,
      passwordHash: userData.passwordHash ?? user.passwordHash,
      roleId: userData.roleId ?? user.roleId,
      avatarUrl: userData.avatarUrl ?? user.avatarUrl,
      status: userData.status ?? user.status,
    });

    // Xử lý profile
    if (userData.profile) {
      await db.Profile.upsert({
        id: user.profile?.id || uuidv4(),
        userId: user.id,
        fullName: userData.profile.fullName,
        phone: userData.profile.phone || null,
        address: userData.profile.address || null,
        dateOfBirth: userData.profile.dateOfBirth || null,
      });
    }

    // Trả về user kèm profile
    return this.getUserById(user.id);
  }

  // Xóa user (có thể đổi thành soft delete sau này)
  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (!user) return false;

    await user.destroy();
    return true;
  }

  // Lấy user theo email
  async getUserByEmail(email, withPassword = false) {
    return withPassword
      ? this.model.scope("withPassword").findOne({ where: { email } })
      : this.model.findOne({ where: { email } });
  }

  // Update hoặc tạo refresh token mới
  async _updateOrCreateRefreshToken(user, token) {
    const expiresAt = getExpiresAtFromToken(token);

    if (user.refreshToken) {
      await user.refreshToken.update({ token, expiresAt });
    } else {
      await user.createRefreshToken({ token, expiresAt });
    }
  }
}

export default UserRepository;