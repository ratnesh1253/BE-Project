const vehicleLocationModel = require("../models/vehicleLocationModel");
const userModel = require("../models/userModel");
const geofenceModel = require("../models/geofenceModel");
const { pointInPolygon } = require("../utils/geoUtils");
const { convertUTCToIST } = require("../utils/utils");

// Controller to record vehicle location
exports.recordVehicleLocation = async (req, res) => {
  const { vehicle_number } = req.params;
  let { time, latitude, longitude, speed } = req.body;

  // Validate incoming data
  if (latitude === undefined || longitude === undefined) {
    console.log("Missing required location data");
    return res.status(400).json({ error: "Missing required location data" });
  }

  //set today's date
  const today = new Date();
  let date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;

  if (time == "00:00:00" || time == undefined || time == null) {
    time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  } else {
    time = convertUTCToIST(time);
  }

  if (speed == undefined || speed == null) {
    speed = 0.0;
  }

  try {
    let foundInGeofencedArea = false;

    // Step 1: Check if the vehicle number exists
    // let user = await userModel.getUserByEmailOrVehicle(vehicle_number);
    let user = await userModel.getUsersByVehicleNumber(vehicle_number);
    console.log("User data:", user);
    if (!user) {
      console.log("Vehicle number not associated with any user");
      return res
        .status(404)
        .json({ error: "Vehicle number not associated with any user" });
    }

    const tableName = `${vehicle_number}_history`;

    // Check if user is within a geofenced area
    const geofences = await geofenceModel.getAllGeofences();
    let charge = 0;

    for (const geofence of geofences) {
      const polygon = [
        [geofence.lat1, geofence.lon1],
        [geofence.lat2, geofence.lon2],
        [geofence.lat3, geofence.lon3],
        [geofence.lat4, geofence.lon4],
      ];

      if (pointInPolygon([latitude, longitude], polygon)) {
        charge = Number(geofence.charges);
        foundInGeofencedArea = true;
        break;
      }
    }

    if (foundInGeofencedArea) {
      let balance = Number(user[0].wallet_balance);
      let dueAmount = Number(user[0].due_amount);
      console.log("balance:", balance);
      console.log("dueAmount:", dueAmount);

      if (charge > 0) {
        // Update user's balance or due amount
        if (balance >= charge) {
          balance -= Number(charge); // Deduct from balance
        } else {
          dueAmount += Number(charge); // Add to due amount
        }

        // Update user data in the database
        await userModel.updateUserBalanceAndDue(
          vehicle_number,
          Number(balance),
          Number(dueAmount)
        );
      }

      // Insert the user's location into their history table
      const locationData = await vehicleLocationModel.insertVehicleLocation(
        tableName,
        {
          date,
          time,
          latitude,
          longitude,
          speed,
          charges_applied: charge,
        }
      );

      console.log("Location recorded inside geofence and charges applied");
      console.log(locationData);

      return res.status(201).json({
        message: "Location recorded inside geofence and charges applied",
        data: locationData,
      });
    } else {
      console.log("Location recorded outside geofence. Not Recorded!");
      return res.status(201).json({
        message: "Location recorded outside geofence",
      });
    }
  } catch (error) {
    console.error("Error recording vehicle location:", error);

    // Handle table not existing
    if (error.message.includes("relation")) {
      console.log(`Table ${vehicle_number}_history does not exist`);
      return res
        .status(404)
        .json({ error: `Table ${vehicle_number}_history does not exist` });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to fetch vehicle location history
exports.getVehicleHistory = async (req, res) => {
  const { vehicle_number } = req.params;

  try {
    const tableName = `${vehicle_number}_history`;

    // Check if history table exists
    const history = await vehicleLocationModel.getVehicleHistory(tableName);
    if (!history || history.length === 0) {
      return res
        .status(404)
        .json({ error: `No history found for vehicle ${vehicle_number}` });
    }

    return res.status(200).json({
      message: `History retrieved for vehicle ${vehicle_number}`,
      data: history,
    });
  } catch (error) {
    console.error("Error retrieving vehicle history:", error);

    // Handle table not existing
    if (error.message.includes("relation")) {
      return res.status(404).json({
        error: `History table for vehicle ${vehicle_number} does not exist`,
      });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
