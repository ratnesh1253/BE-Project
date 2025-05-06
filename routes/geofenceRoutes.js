const express = require("express");
const router = express.Router();
const geofenceController = require("../controllers/geofenceController");

// Route to add a geofence
router.post("/add", geofenceController.addGeofence);

// Route to show all geofences
router.get("/show", geofenceController.showGeofences);

router.put("/update/:id", geofenceController.updateGeofence);

router.delete("/delete/:id", geofenceController.deleteGeofence);

module.exports = router;
