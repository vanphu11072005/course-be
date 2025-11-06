import auth from "./auth.middleware.js";
import errorHandler from "./error.middleware.js";
import role from "./role.middleware.js";
import upload from "./upload.middleware.js";
import { checkMaintenance } from "./maintenance.middleware.js";

export default {
  auth,
  errorHandler,
  role,
  upload,
  checkMaintenance,
};
