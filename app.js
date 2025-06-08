const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
// const session = require("express-session");
// const flash = require("connect-flash");
const cors = require("cors");

// Import routes
const vehicleRoutes = require("./routes/vehicleRoutes");
const geofenceRoutes = require("./routes/geofenceRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
// app.set("view engine", "ejs");

app.use(
  cors({
    origin: "*", // or use '*' for all origins (not recommended in production)
    credentials: true, // if you're sending cookies or authentication headers
  })
);

// Middleware to parse JSON data
app.use(express.json());

// Public folder for static files
app.use(express.static("public"));

//Middleware for flash messages
// app.use(
//   session({ secret: "your-secret", resave: false, saveUninitialized: true })
// );
// app.use(flash());

// Set flash messages to res.locals
// app.use((req, res, next) => {
//   res.locals.messages = req.flash();
//   next();
// });

app.get("/", (req, res) => {
  res.send("✅ Hello from your EC2 Node.js server!");
});

// Routes
app.use("/vehicle", vehicleRoutes);

app.use("/geofence", geofenceRoutes);

app.use("/user", userRoutes);

app.use("/admin", adminRoutes);

// Start the server
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
