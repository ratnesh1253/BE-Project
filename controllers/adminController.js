const bcrypt = require("bcrypt");
const adminModel = require("../models/adminModel");
const geofenceController = require("../controllers/geofenceController");
const geofenceModel = require("../models/geofenceModel");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.getAdminByEmail(email);
    console.log(admin);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const geofences = await geofenceController.showGeofences();
    const geofences = await geofenceModel.getAllGeofences();
    console.log("geofences", geofences);

    res.status(200).json({
      message: "Login successful",
      token: "akaka",
      admin: {
        id: admin.id,
        name: `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
        geofences: geofences,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdmin = async (req, res) => {
  const { email } = req.params;

  try {
    const admin = await adminModel.getAdminByEmail(email);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Login successful",
      token: "akaka", // Replace with real token logic
      admin, // no need to wrap again
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
