const express = require("express");
const router = express.Router();
const {
  getProducts,
  getSecretProduct,
} = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");

router.get("/", getProducts);

// protected route
router.get("/secret", verifyToken, getSecretProduct);

module.exports = router;
