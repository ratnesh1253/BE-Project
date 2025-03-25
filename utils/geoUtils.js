// Check if a point is inside a polygon (Point-in-Polygon Algorithm)
exports.pointInPolygon = (point, polygon) => {
  let insideGeofence = false;
  let lat = false;
  let long = false;

  if (
    (polygon[0][0] >= point[0] && polygon[3][0] <= point[0]) ||
    (polygon[1][0] >= point[0] && polygon[2][0] <= point[0])
  ) {
    lat = true;
  }

  if (
    (polygon[0][1] <= point[1] && polygon[1][1] >= point[1]) ||
    (polygon[2][1] >= point[1] && polygon[3][1] <= point[1])
  ) {
    long = true;
  }

  if (lat && long) {
    insideGeofence = true;
  }

  return insideGeofence;
};
