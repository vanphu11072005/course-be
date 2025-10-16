import Joi from "joi";
import middlewares from "../middlewares/index.js";

class UserValidator {
  constructor() {}

  registerSchema() {
    return middlewares.validate(
      Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(50).required(),
        confirmPassword: Joi.any()
          .valid(Joi.ref("password"))
          .required()
          .messages({ "any.only": "Passwords must match" }),
      })
    );
  }
}

export default UserValidator;
