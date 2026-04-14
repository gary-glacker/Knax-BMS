const express = require('express');
const cors = require('cors');

const App = express();

App.use(cors());
App.use(express.json());

// Import Routers
const UserRouter = require("./src/Router/userRouter");
const RoleRouter = require("./src/Router/roleRouter");
const StaffRouter = require("./src/Router/staffRouter");
const InternRouter = require("./src/Router/internRouter");
const ProductRouter = require("./src/Router/productRouter");
const InventoryRouter = require("./src/Router/inventoryRouter");
const SystemRouter = require("./src/Router/systemRouter");
const SupplyRouter = require("./src/Router/supplyRouter");
const ReportRouter = require("./src/Router/reportRouter");
const StudentFeaturesRouter = require("./src/Router/studentFeaturesRouter");
const StudentRouter = require("./src/Router/studentRouter");
const TradeRouter = require("./src/Router/tradeRouter");
const LevelRouter = require("./src/Router/levelRouter");
const NotificationRouter = require("./src/Router/notificationRouter");

// Register Routes
App.use("/api/users", UserRouter);
App.use("/api/roles", RoleRouter);
App.use("/api/staff", StaffRouter);
App.use("/api/interns", InternRouter);
App.use("/api/inventory", InventoryRouter);
App.use("/api/products", ProductRouter);
App.use("/api/system", SystemRouter);
App.use("/api/supply", SupplyRouter);
App.use("/api/reports", ReportRouter);
App.use("/api/student-features", StudentFeaturesRouter);
App.use("/api/students", StudentRouter);
App.use("/api/trades", TradeRouter);
App.use("/api/levels", LevelRouter);
App.use("/api/notifications", NotificationRouter);

// Start Server
const Port = process.env.PORT || 4500;
App.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});