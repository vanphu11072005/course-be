import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.config.js";
import db from "../database/models/index.js";

const { User, Role } = db;

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtConfig.JWT_SECRET);

    const user = await User.findByPk(decoded.sub, {
      include: { model: Role, as: "role" }
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
