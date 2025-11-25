const { verifyToken } = require("../utils/jwt");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);

  if (!decoded)
    return res.status(401).json({ error: "Invalid or expired token" });

  req.user = decoded;
  next();
};
