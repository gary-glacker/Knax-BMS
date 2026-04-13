const db = require("../config/db");

//    Get general metrics/report data
//    GET /api/reports/summary
const GetSummaryReport = async (req, res) => {
  try {
    const [[{ total_staff }]] = await db.query(
      "SELECT COUNT(*) AS total_staff FROM `staff`",
    );
    const [[{ total_interns }]] = await db.query(
      "SELECT COUNT(*) AS total_interns FROM `interns`",
    );
    const [[{ total_users }]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM `users`",
    );
    const [[{ pending_orders }]] = await db.query(
      "SELECT COUNT(*) AS pending_orders FROM `supply_orders` WHERE `status` = 'Pending'",
    );

    res.status(200).json({
      staffCount: total_staff,
      internsCount: total_interns,
      usersCount: total_users,
      pendingOrders: pending_orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { GetSummaryReport };
