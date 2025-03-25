const express = require("express");
const router = express.Router();
const geofenceController = require("../controllers/geofenceController");

// Render the Add Geofence form
router.get("/add", (req, res) => {
  res.render("addGeofence");
});

// Route to add a geofence
router.post("/add", geofenceController.addGeofence);

// Route to show all geofences
router.get("/show", geofenceController.showGeofences);

module.exports = router;
