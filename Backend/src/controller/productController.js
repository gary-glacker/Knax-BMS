const db = require("../config/db");

// Get all products
// GET /api/products
const GetAllProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.status(200).json({ message:"Products retrieved", data:products});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new product
// POST /api/products
const CreateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;
    if (!name || !category || !description || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Please provide name, category, description, price, and stock" });
    }
    const [result] = await db.query(
      "INSERT INTO `products`(`id`, `name`, `category`, `price`, `initialStock`, `description`) VALUES (?, ?, ?, ?, ?, ?)",
      [null, name, category, price, stock, description]
    );
    res.status(201).json({ message: "Product created", id: result.insertId });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update a product
// PUT /api/products/:id
const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, stock } = req.body;
    if (!name || !category || !description || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Please provide name, category, description, price, and stock" });
    }
    const [result] = await db.query(
      "UPDATE `products` SET `name` = ?, `category` = ?, `description` = ?, `price` = ?, `stock` = ? WHERE `id` = ?",
      [name, category, description, price, stock, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete a product
// DELETE /api/products/:id
const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM `products` WHERE `id` = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  GetAllProducts, CreateProduct, UpdateProduct, DeleteProduct
};
