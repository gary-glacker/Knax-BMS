const {
  CreateProduct, 
  GetAllProducts, 
  UpdateProduct,
  DeleteProduct
} = require("../controller/productController");
const express = require('express');
const router = express.Router();

router.post("/", CreateProduct);
router.get("/", GetAllProducts);
router.put("/:id", UpdateProduct);
router.delete("/:id", DeleteProduct);

module.exports = router