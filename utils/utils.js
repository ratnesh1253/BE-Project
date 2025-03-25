// Helper function to get today's date
exports.getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

// Haversine formula to calculate distance in kilometers
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

exports.convertUTCToIST = (timeString) => {
  // Convert the time string to a Date object assuming it's in UTC
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(hours, minutes, seconds, 0); // Set UTC time

  // Convert to IST by formatting with the Asia/Kolkata timezone
  const istTimeString = date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false, // 24-hour format
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return istTimeString;
};
