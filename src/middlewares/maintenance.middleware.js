import db from "../database/models/index.js";

export const checkMaintenance = async (req, res, next) => {
  try {
    // Nếu admin đã verify bỏ qua
    if (req.user && req.user.role?.name === "admin") return next();

    const setting = await db.Setting.findOne();
    if (setting?.maintenanceMode) {
      return res.status(503).json({ message: "Website đang bảo trì!" });
    }

    next();
  } catch (err) {
    console.error("Maintenance error:", err);
    next(err);
  }
};

