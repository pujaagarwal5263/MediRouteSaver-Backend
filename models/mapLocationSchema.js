const mongoose = require("mongoose");

const mapLocationSchema = new mongoose.Schema({
    Postcode: String,
    Name: String,
    Latitude: Number,
    Longitude: Number,
  });
  
  const MapLocation = mongoose.model("MapLocation", mapLocationSchema);
  module.exports = MapLocation;