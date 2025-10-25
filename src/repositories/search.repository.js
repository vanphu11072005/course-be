import db from "../database/models/index.js";
import { Op } from "sequelize";

class SearchRepository {
  async searchAll(query) {
    console.log("🧩 [Repository] Query nhận:", query);

    if (!query) return [];

    try {
      const users = await db.User.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
            { "$profile.phone$": { [Op.like]: `%${query}%` } },
          ],
        },
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: ["phone"],
            required: false,
          },
        ],
        limit: 5,
      });

      const courses = await db.Course.findAll({
        where: { title: { [Op.like]: `%${query}%` } },
        limit: 5,
      });

      const orders = await db.Order.findAll({
        where: { note: { [Op.like]: `%${query}%` } },
        limit: 5,
      });

      console.log("✅ [Repository] Tìm thấy:", {
        users: users.length,
        courses: courses.length,
        orders: orders.length,
      });

      return [
        ...users.map((u) => ({ type: "User", ...u.dataValues })),
        ...courses.map((c) => ({ type: "Course", ...c.dataValues })),
        ...orders.map((o) => ({ type: "Order", ...o.dataValues })),
      ];
    } catch (err) {
      console.error("🔥 [Repository] Lỗi khi truy vấn DB:", err);
      throw err;
    }
  }
}

export default SearchRepository;
