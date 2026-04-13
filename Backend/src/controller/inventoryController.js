const db = require("../config/db");

//    Get all inventory with product details
//    GET /api/inventory
const GetInventory = async (req, res) => {
  try {
    const [inventory] = await db.query(`
            SELECT i.id, i.quantity, p.name 
            FROM inventory i
            JOIN products p ON i.product_id = p.id
        `);
    res.status(200).json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Get stock movements
//    GET /api/inventory/movements
const GetMovements = async (req, res) => {
  try {
    const [movements] = await db.query(`
            SELECT m.id, m.change_type, m.quantity, p.name 
            FROM stock_movements m
            JOIN products p ON m.product_id = p.id
        `);
    res.status(200).json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { GetInventory, GetMovements };
