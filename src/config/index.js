import database from "./db.config.js";
import jwt from "./jwt.config.js";

export default {
  database,
  port: process.env.PORT || 3000,
  jwt,
  logging: process.env.LOGGING === "true",
  apiVersion: process.env.API_VERSION || "v1",
  environment: process.env.NODE_ENV || "development",
};
