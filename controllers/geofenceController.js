const geofenceModel = require("../models/geofenceModel");

// Add a new geofence
exports.addGeofence = async (req, res) => {
  const {
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
    adminId,
  } = req.body;

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
    !charges ||
    !adminId
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
      adminId,
    });

    res.status(200).json({
      success: true,
      message: "Geofence added successfully!",
      data: result, // Include the created geofence data if needed
    });
  } catch (err) {
    console.error("Error adding geofence:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to add geofence.",
      error: err.message,
    });
  }
};

// Show all geofences
exports.showGeofences = async (req, res) => {
  try {
    const geofences = await geofenceModel.getAllGeofences();
    res.status(200).json(geofences);
  } catch (err) {
    console.error("", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving geofences." });
  }
};

// In your backend controller
exports.updateGeofence = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const result = await geofenceModel.updateGeofence(id, updateData);
    res.status(200).json({
      success: true,
      message: "Geofence updated successfully!",
      data: result,
    });
  } catch (err) {
    console.error("Error updating geofence:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to update geofence.",
      error: err.message,
    });
  }
};

exports.deleteGeofence = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await geofenceModel.deleteGeofence(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Geofence not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Geofence deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting geofence:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete geofence",
      error: err.message,
    });
  }
};
