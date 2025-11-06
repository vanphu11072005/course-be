import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.config.js";

/**
 * Tạo access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, jwtConfig.JWT_SECRET, {
    expiresIn: jwtConfig.JWT_EXPIRES_IN,
  });
};

/**
 * Tạo refresh token và lưu vào DB
 * @param {string} userId
 * @param {object} refreshTokenRepo - instance của UserService
 */
export const generateRefreshToken = async (userId, refreshTokenRepo) => {
  if (!refreshTokenRepo) throw new Error("refreshTokenRepo required");
  // Đảm bảo chỉ 1 refresh token cho 1 user: xóa token cũ trước khi tạo
  await refreshTokenRepo.revokeByUserId(userId);

  const refreshToken = jwt.sign({ sub: userId }, jwtConfig.JWT_REFRESH_SECRET, {
    expiresIn: jwtConfig.JWT_REFRESH_EXPIRES_IN,
  });

  // Lấy expiresAt từ token và lưu vào bảng refresh_tokens
  const expiresAt = getExpiresAtFromToken(refreshToken);
  await refreshTokenRepo.create({ userId, token: refreshToken, expiresAt });

  return refreshToken;
};

/**
 * Tạo cả 2 token
 * @param {string} userId
 * @param {boolean} accessTokenOnly - nếu true chỉ trả accessToken
 * @param {object} refreshTokenRepo
 */
export const generateTokens = async (
  userId,
  accessTokenOnly = false,
  refreshTokenRepo
) => {
  const accessToken = generateAccessToken(userId);

  if (accessTokenOnly) return { accessToken };

  const refreshToken = await generateRefreshToken(userId, refreshTokenRepo);
  return { accessToken, refreshToken };
};

/**
 * Verify token
 */
export const verifyToken = (token, type = "access") => {
  try {
    const secret =
      type === "refresh" ? jwtConfig.JWT_REFRESH_SECRET : jwtConfig.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

/**
 * Lấy expiresAt từ token
 */
export const getExpiresAtFromToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded?.exp) return null;
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
};

/**
 * Set token vào cookie
 */
export const setTokensAsCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // production: true
      expires: getExpiresAtFromToken(accessToken),
    });
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // production: true
      expires: getExpiresAtFromToken(refreshToken),
    });
  }
};