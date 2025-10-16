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
 * @param {object} userService - instance của UserService
 */
export const generateRefreshToken = async (userId, userService) => {
  if (!userService) throw new Error("userService instance required");

  const refreshToken = jwt.sign({ sub: userId }, jwtConfig.JWT_REFRESH_SECRET, {
    expiresIn: jwtConfig.JWT_REFRESH_EXPIRES_IN,
  });

  // Cập nhật vào DB
  await userService.updateUser(userId, { refreshToken }, true);

  return refreshToken;
};

/**
 * Tạo cả 2 token
 * @param {string} userId
 * @param {boolean} accessTokenOnly - nếu true chỉ trả accessToken
 * @param {object} userService - instance của UserService
 */
export const generateTokens = async (userId, accessTokenOnly = false, userService) => {
  const accessToken = generateAccessToken(userId);

  if (accessTokenOnly) return { accessToken };

  const refreshToken = await generateRefreshToken(userId, userService);
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
