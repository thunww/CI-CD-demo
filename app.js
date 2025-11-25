const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

module.exports = app;

if (require.main === module) {
  app.listen(3000, () => console.log("Server running on port 3000"));
}
