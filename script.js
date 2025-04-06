const axios = require("axios");

const vehicleNumber = "MH12AB1234"; // Make sure this matches what's in DB and route
const url = `http://192.168.78.5:8080/${vehicleNumber}/location`;

let baseTime = new Date("2025-04-03T11:31:00");
let count = 0;
const maxRequests = 7;

function sendData() {
  if (count >= maxRequests) {
    console.log("Finished sending all requests.");
    return;
  }

  const payload = {
    time: baseTime.toTimeString().slice(0, 8), // e.g. 11:31:00
    latitude: 17.983009,
    longitude: 74.492735,
    speed: 60,
  };

  console.log(`Sending [${count + 1}/7] at time ${payload.time}`);

  axios
    .post(url, payload)
    .then((response) => {
      console.log(`✅ Success:`, response.data.message);
    })
    .catch((error) => {
      if (error.response) {
        console.error(`❌ Error:`, error.response.status, error.response.data);
      } else {
        console.error("❌ Error:", error.message);
      }
    });

  baseTime.setMinutes(baseTime.getMinutes() + 1);
  count++;

  if (count < maxRequests) {
    setTimeout(sendData, 5000);
  }
}

sendData();
