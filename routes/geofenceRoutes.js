const express = require("express");
const router = express.Router();
const geofenceController = require("../controllers/geofenceController");

// Route to add a geofence
router.post("/add", geofenceController.addGeofence);

// Route to show all geofences
router.get("/show", geofenceController.showGeofences);

module.exports = router;
