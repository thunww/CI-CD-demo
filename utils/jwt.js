const jwt = require("jsonwebtoken");

const SECRET = "MY_SUPER_SECRET";

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};
