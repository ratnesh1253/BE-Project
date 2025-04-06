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

// Route for registration page
app.get("/register", (req, res) => {
  res.render("register");
});

// Route for login page
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", async (req, res) => {
  try {
    const user = JSON.parse(decodeURIComponent(req.query.user));

    console.log("user: in profile", user);

    // Render profile page with fetched data
    res.render("profile", {
      username: user.username,
      email: user.email,
      vehicle_number: user.vehicle_number,
      wallet_balance: user.wallet_balance,
      due_amount: user.due_amount,
      qr_code: user.qr_code,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).send("Failed to fetch user information");
  }
});

// Route for input page
app.get("/input", (req, res) => {
  res.render("input");
});

// Route for addMoney page
app.get("/addMoney", (req, res) => {
  res.render("addMoney");
});

// Routes
app.use("/vehicle", vehicleRoutes);

app.use("/geofence", geofenceRoutes);

app.use("/user", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
