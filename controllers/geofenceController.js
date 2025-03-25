const geofenceModel = require("../models/geofenceModel");

// Add a new geofence
exports.addGeofence = async (req, res) => {
  const { name, lat1, lon1, lat2, lon2, lat3, lon3, lat4, lon4, charges } =
    req.body;

  if (
    !name ||
    !lat1 ||
    !lon1 ||
    !lat2 ||
    !lon2 ||
    !lat3 ||
    !lon3 ||
    !lat4 ||
    !lon4 ||
    !charges
  ) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const result = await geofenceModel.insertGeofence({
      name,
      lat1,
      lon1,
      lat2,
      lon2,
      lat3,
      lon3,
      lat4,
      lon4,
      charges,
    });
    req.flash("success", "Geofence added successfully!");
    // res.redirect("/geofence/show");
    res.status(200).send("Geofence added successfully!");
  } catch (err) {
    console.error("Error adding geofence:", err.message);
    req.flash("error", "Failed to add geofence.");
    // res.redirect("/geofence/show");
    res.status(500).send("Failed to add geofence.");
  }
};

// Show all geofences
exports.showGeofences = async (req, res) => {
  try {
    const geofences = await geofenceModel.getAllGeofences();
    res.render("showGeofence", { geofences });
  } catch (err) {
    console.error("Error retrieving geofences:", err.message);
    res.status(500).send("An error occurred while retrieving geofences.");
  }
};
