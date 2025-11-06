import db from "../database/models/index.js";

export const checkMaintenance = async (req, res, next) => {
  try {
    const setting = await db.Setting.findOne();
    const isMaintenance = setting?.maintenanceMode;

    const isAdminRoute = req.path.startsWith("/api/admin");
    const isAuthRoute = req.path.startsWith("/api/auth");

    if (!isMaintenance) return next();

    if (isAuthRoute || req.path.includes("/login")) return next();

    if (req.user && req.user.role?.name === "admin") return next();

    if (isAdminRoute && (!req.user || req.user.role?.name !== "admin")) {
      return res.status(401).json({ message: "Vui lòng đăng nhập quản trị" });
    }

    return res.status(503).json({ message: "Website đang bảo trì!" });
  } catch (err) {
    console.error("Maintenance middleware error:", err);
    next(err);
  }
};
