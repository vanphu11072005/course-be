import BaseController from "./base.controller.js";
import UserService from "../services/user.service.js";
import * as HashHelper from "../helpers/hash.helper.js";
import * as JwtHelper from "../helpers/jwt.helper.js";
import db from "../database/models/index.js";

class AuthController extends BaseController {
  constructor() {
    super();
    this.service = new UserService();
  }

  async register(req, res) {
    const { name, email, password } = req.body;

    const existingUser = await this.service.getUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "User exists" });

    const passwordHash = await HashHelper.hashPassword(password);

    const studentRole = await db.Role.findOne({ where: { name: "student" } });
    if (!studentRole) {
      return res.status(500).json({ message: "Default role not found" });
    }

    await this.service.createUser({
      name,
      email,
      passwordHash,
      roleId: studentRole.id,
    });

    res.status(201).json({ message: "User created" });
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await this.service.getUserByEmail(email, true); // with password
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await HashHelper.comparePassword(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Luôn trả cả 2 token, truyền this.service vào helper
    const { accessToken, refreshToken } = await JwtHelper.generateTokens(
      user.id,
      false,
      this.service
    );

    // Set token vào cookie
    JwtHelper.setTokensAsCookies(res, accessToken, refreshToken);

    res.json({ accessToken, refreshToken });
  }

  async refreshToken(req, res) {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    console.log(">>> Refresh token received:", token);

    if (!token)
      return res.status(401).json({ message: "Missing refresh token" });

    const payload = JwtHelper.verifyToken(token, "refresh");
    if (!payload)
      return res.status(403).json({ message: "Invalid refresh token" });

    const user = await this.service.getUserById(payload.sub, true);

    // Kiểm tra user tồn tại trước khi đọc refreshToken
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra refreshToken tồn tại và trùng với token client gửi
    if (!user.refreshToken || user.refreshToken !== token) {
      return res.status(403).json({ message: "Refresh token revoked" });
    }

    const { accessToken, refreshToken } = await JwtHelper.generateTokens(
      payload.sub,
      false,
      this.service
    );

    JwtHelper.setTokensAsCookies(res, accessToken, refreshToken);
    res.json({ accessToken, refreshToken });
  }

  async logout(req, res) {
    const userId = req.user?.id;
    if (userId)
      await this.service.updateUser(userId, { refreshToken: null }, true);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Signed out" });
  }

  async getProfile(req, res) {
    res.json(req.user);
  }
}

export default new AuthController;
