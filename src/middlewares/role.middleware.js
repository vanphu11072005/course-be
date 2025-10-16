const role = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({ message: "Forbidden: insufficient rights" });
    }

    next();
  };
};

export default role;
