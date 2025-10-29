import db from "../database/models/index.js";

export const checkMaintenance = async (req, res, next) => {
  try {
    const setting = await db.Setting.findOne();
    const isMaintenance = setting?.maintenanceMode;

    const isAdminRoute = req.path.startsWith("/api/admin");
    const isAuthRoute = req.path.startsWith("/api/auth");

    // Nếu không bảo trì => cho qua
    if (!isMaintenance) return next();

    // Cho phép admin login/logout/refresh token trong lúc bảo trì
    if (isAuthRoute || req.path.includes("/login")) return next();

    // Nếu request đã có user và là admin => cho qua
    if (req.user && req.user.role?.name === "admin") return next();

    // Nếu route là admin mà chưa login -> chặn
    if (isAdminRoute && (!req.user || req.user.role?.name !== "admin")) {
      return res.status(401).json({ message: "Vui lòng đăng nhập quản trị" });
    }

    // Các route khác (user) => chặn hết
    return res.status(503).json({ message: "Website đang bảo trì!" });
  } catch (err) {
    console.error("Maintenance middleware error:", err);
    next(err);
  }
};
