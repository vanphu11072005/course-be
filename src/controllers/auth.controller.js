import BaseController from "./base.controller.js";
import UserService from "../services/user.service.js";
import RefreshTokenRepository from "../repositories/refreshToken.repository.js";
import * as HashHelper from "../helpers/hash.helper.js";
import * as JwtHelper from "../helpers/jwt.helper.js";
import * as MailHelper from "../helpers/mailer.helper.js";
import db from "../database/models/index.js";

class AuthController extends BaseController {
  constructor() {
    super();
    this.service = new UserService();
    this.refreshTokenRepo = new RefreshTokenRepository();
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, password are required" });
      }

      const existingUser = await this.service.getUserByEmail(email);
      if (existingUser)
        return res.status(400).json({
          message: "Email đã được sử dụng",
          field: "email",
        });

      const studentRole = await db.Role.findOne({ where: { name: "student" } });
      if (!studentRole) {
        return res.status(500).json({ message: "Default role not found" });
      }

      const user = await this.service.createUser({
        name,
        email,
        password,
        roleId: studentRole.id,
      });

      await db.Profile.create({ userId: user.id, fullName: user.name });

      const verifyToken = JwtHelper.generateAccessToken(
        { sub: email },
        "verify",
        "15m"
      );

      const verifyLink = `${process.env.FRONTEND_URL}/auth/verify-email/${verifyToken}`;

      await MailHelper.sendMail(
        email,
        "Xác minh địa chỉ email của bạn",
        `<h2>Xin chào ${name}</h2>
       <p>Nhấn vào link để xác minh: <a href="${verifyLink}">Xác minh ngay</a></p>`
      );

      res.status(201).json({
        message:
          "User created successfully. Please check your email to verify your account.",
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
        stack: error.stack,
      });
    }
  }

  // ✅ API xác minh email (GET /api/auth/verify-email?token=...)
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      if (!token)
        return res.status(400).json({ message: "Missing verification token" });

      const payload = JwtHelper.verifyToken(token, "verify");
      if (!payload)
        return res.status(400).json({ message: "Invalid or expired token" });

      res.json({
        message: "Email verified successfully ✅",
        email: payload.sub,
      });
    } catch (err) {
      console.error("Verify email error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await this.service.getUserByEmail(email, true);
    if (!user)
      return res.status(400).json({
        message: "Email hoặc mật khẩu không chính xác",
      });

    const valid = await HashHelper.comparePassword(password, user.passwordHash);
    if (!valid)
      return res.status(400).json({
        message: "Email hoặc mật khẩu không chính xác",
      });

    const { accessToken, refreshToken } = await JwtHelper.generateTokens(
      user.id,
      false,
      this.refreshTokenRepo
    );

    // Set token vào cookie
    JwtHelper.setTokensAsCookies(res, accessToken, refreshToken);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    };
    res.json({ accessToken, refreshToken, user: userData });
  }

  async refreshToken(req, res) {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token)
      return res.status(401).json({ message: "Missing refresh token" });

    const payload = JwtHelper.verifyToken(token, "refresh");
    if (!payload)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Kiểm tra token có tồn tại trong bảng refresh_tokens
    const stored = await this.refreshTokenRepo.findByToken(token);
    if (!stored || stored.userId !== payload.sub)
      return res.status(403).json({ message: "Refresh token revoked" });

    // Tìm user để trả về nếu cần
    const user = await this.service.getUserById(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { accessToken, refreshToken } = await JwtHelper.generateTokens(
      payload.sub,
      false,
      this.refreshTokenRepo
    );

    JwtHelper.setTokensAsCookies(res, accessToken, refreshToken);
    res.json({ accessToken, refreshToken });
  }

  async logout(req, res) {
    const userId = req.user?.id;
    if (userId) await this.refreshTokenRepo.revokeByUserId(userId);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Signed out" });
  }

  async getProfile(req, res) {
    res.json(req.user);
  }
}

export default new AuthController();
