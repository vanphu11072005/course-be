import crypto from "crypto";

export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};
