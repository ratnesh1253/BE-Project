const express = require("express");
const router = express.Router();
const vehicleLocationController = require("../controllers/vehicleLocationController");

// Route to receive and store vehicle data
router.post(
  "/:vehicle_number/location",
  vehicleLocationController.recordVehicleLocation
);

// Route to fetch vehicle history
router.get(
  "/:vehicle_number/history",
  vehicleLocationController.getVehicleHistory
);

module.exports = router;
