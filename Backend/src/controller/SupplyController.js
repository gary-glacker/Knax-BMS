const db = require("../config/db");

//    Get all suppliers
//    GET /api/supply/suppliers
const GetSuppliers = async (req, res) => {
  try {
    const [suppliers] = await db.query("SELECT * FROM `suppliers`");
    res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Create a supplier
//    POST /api/supply/suppliers
const CreateSupplier = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Supplier name is required" });

    const [result] = await db.query(
      "INSERT INTO `suppliers` (`name`) VALUES (?)",
      [name],
    );
    res.status(201).json({ message: "Supplier created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Get all supply orders
//    GET /api/supply/orders
const GetSupplyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
            SELECT o.id, o.order_date, o.status, s.name as supplier_name 
            FROM supply_orders o
            JOIN suppliers s ON o.supplier_id = s.id
        `);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Create a supply order
//    POST /api/supply/orders
const CreateSupplyOrder = async (req, res) => {
  try {
    const { supplier_id, order_date, status } = req.body;
    if (!supplier_id || !order_date || !status) {
      return res.status(400).json({
        message: "Please provide supplier_id, order_date, and status",
      });
    }

    const [result] = await db.query(
      "INSERT INTO `supply_orders` (`supplier_id`, `order_date`, `status`) VALUES (?, ?, ?)",
      [supplier_id, order_date, status],
    );
    res
      .status(201)
      .json({ message: "Supply order created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Get items for a specific order
//    GET /api/supply/orders/:id/items
const GetSupplyItemsByOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [items] = await db.query(
      `
            SELECT i.id, i.quantity, i.price, p.name as product_name
            FROM supply_items i
            JOIN products p ON i.product_id = p.id
            WHERE i.order_id = ?
        `,
      [id],
    );
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  GetSuppliers,
  CreateSupplier,
  GetSupplyOrders,
  CreateSupplyOrder,
  GetSupplyItemsByOrder,
};
