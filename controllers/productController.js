exports.getProducts = (req, res) => {
  return res.json({
    success: true,
    data: [
      { id: 1, name: "Chair" },
      { id: 2, name: "Table" },
      { id: 3, name: "Lamp" },
    ],
  });
};

exports.getSecretProduct = (req, res) => {
  return res.json({
    success: true,
    secret: "This is protected product info",
    user: req.user,
  });
};
