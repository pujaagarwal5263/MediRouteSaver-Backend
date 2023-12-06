const fs = require('fs');
const path = require('path');
const MapLocation = require("./models/mapLocationSchema");
const RouteArray = require("./models/routeArraySchema")

async function insertData() {
  try {
    const filePath = path.join(__dirname, 'data/data.json');
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);

    const result = await MapLocation.insertMany(data);
    console.log(`${result.length} documents inserted`);
  } catch (error) {
    console.error("Error inserting documents:", error);
  }
}

insertData();

async function insertRouteData() {
  try {
    const filePath = path.join(__dirname, 'data/routedata.json');
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);

    const result = await MapLocation.insertMany(data);
    console.log(`${result.length} documents inserted`);
  } catch (error) {
    console.error("Error inserting documents:", error);
  }
}

insertRouteData();