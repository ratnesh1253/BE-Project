const express = require("express");
const app = express();
const port = 8080;
const session = require("express-session");
const flash = require("connect-flash");

// Import routes
const vehicleRoutes = require("./routes/vehicleRoutes");
const geofenceRoutes = require("./routes/geofenceRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse JSON data
app.use(express.json());

// Public folder for static files
app.use(express.static("public"));

//Middleware for flash messages
app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: true })
);
app.use(flash());

// Set flash messages to res.locals
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

// Routes
app.use("/vehicle", vehicleRoutes);

app.use("/geofence", geofenceRoutes);

app.use("/user", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
