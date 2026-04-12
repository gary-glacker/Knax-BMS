const express = require('express');
const router = express.Router();
const { 
    GetSuppliers, CreateSupplier, GetSupplyOrders, CreateSupplyOrder, GetSupplyItemsByOrder 
} = require("../controller/SupplyController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/suppliers", GetSuppliers);
router.post("/suppliers", CreateSupplier);

router.get("/orders", GetSupplyOrders);
router.post("/orders", CreateSupplyOrder);

router.get("/orders/:id/items", GetSupplyItemsByOrder);

module.exports = router;
