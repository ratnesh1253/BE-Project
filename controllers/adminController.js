const bcrypt = require("bcrypt");
const adminModel = require("../models/adminModel");
const geofenceController = require("../controllers/geofenceController");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.getAdminByEmail(email);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const geofences = await geofenceController.showGeofences();

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
