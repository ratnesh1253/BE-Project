const axios = require("axios");

const baseUrl = `http://localhost:8080/vehicle/MH12AB1234/location`;
const coordinates = [
  { lat: "17.984614", lng: "74.473499" },
  { lat: "17.984097", lng: "74.475491" },
  { lat: "17.983906", lng: "74.476230" },
  { lat: "17.983623", lng: "74.480481" },
  { lat: "17.983691", lng: "74.478884" },
  { lat: "17.983230", lng: "74.486076" },
];

// Starting time (12:12:12)
let time = {
  hours: 12,
  minutes: 12,
  seconds: 12,
};

// Function to format time as HH:MM:SS
function formatTime() {
  return `${time.hours.toString().padStart(2, "0")}:${time.minutes
    .toString()
    .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`;
}

// Function to add 50 seconds to the time
function add5Seconds() {
  time.seconds += 50;
  if (time.seconds >= 60) {
    time.seconds -= 60;
    time.minutes += 1;
    if (time.minutes >= 60) {
      time.minutes -= 60;
      time.hours += 1;
    }
  }
}

// Function to generate random speed between 30 and 80
function getRandomSpeed() {
  return Math.floor(Math.random() * 50) + 30; // 30-80 km/h
}

// Function to make the API call
async function makeRequest(index) {
  const coord = coordinates[index % coordinates.length];
  const speed = getRandomSpeed().toString();

  const data = {
    time: formatTime(),
    latitude: coord.lat,
    longitude: coord.lng,
    speed: speed,
  };

  try {
    const response = await axios.post(baseUrl, data);
    console.log(`Request ${index + 1} successful:`, response.status, data);
  } catch (error) {
    console.error(`Request ${index + 1} failed:`, error.message);
  }

  add5Seconds();
}

// Function to run requests with 1 second delay between them
async function runRequests(totalRequests) {
  for (let i = 0; i < totalRequests; i++) {
    await makeRequest(i);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 1 second delay
  }
}

// Run 20 requests (will cycle through coordinates 3+ times)
runRequests(20).then(() => console.log("All requests completed"));
