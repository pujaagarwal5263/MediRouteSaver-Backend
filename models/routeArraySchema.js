const mongoose = require("mongoose");

const routeArraySchema = new mongoose.Schema({
  Route: String,
  RouteOrder: [],
});

const RouteArray = mongoose.model("RouteArray", routeArraySchema);
module.exports = RouteArray;
