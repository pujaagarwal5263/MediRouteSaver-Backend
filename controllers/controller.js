const fs = require('fs');
const routeArray = require("../models/routeArraySchema");
const MapLocation = require("../models/mapLocationSchema");
const axios = require("axios")

function encodeTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

const apiUrl = 'http://127.0.0.1:5000/predict-route';
const RouteArrayByIdx = ["RTE01","RTE02","RTE03","RTE04","RTE05","RTE06","RTE07","RTE08","RTE09","RTE10"]

const helloServer = (req,res) => {
    return res.send("Hello, server running!");
}

const getOrderBasedOnRouteID = async (req, res) => {
    const postcodeData = fs.readFileSync('./postcodeinfo.json', 'utf8');
    const Postcode_Encoding = JSON.parse(postcodeData);

    const data = req.body.state;
    const selectedEntries = data.selectedEntries;

    const result = selectedEntries.map(entry => {
        const postalCodeObj = Postcode_Encoding.find(item => item.Postcode === entry.postalCode);
        const postalCodeID = postalCodeObj ? postalCodeObj.stop_id : null;
    
        const encodedTime = encodeTimeToMinutes(entry.dateTime.split('T')[1].slice(0, 5)); // Extract time and encode
    
        return [postalCodeID, encodedTime];
    });
    
    const postData = {
        features: result
      };

    const prediction = await axios.post(apiUrl, postData);
    const finalPrediction =  prediction.data.prediction;
    const route = RouteArrayByIdx[finalPrediction[0]];

    const postalcode_array = selectedEntries.map(entry => entry.postalCode);
    
    const foundRoute = await routeArray.findOne({ Route: route });

    if (!foundRoute) {
        return res.status(404).json({ message: 'Route not found' });
    }
    const RouteOrder = foundRoute.RouteOrder;

    // // Filter postal codes that are in RouteOrder
    const codesInOrder = postalcode_array.filter(code => RouteOrder.includes(code));

    // // Sort postal codes based on their index in RouteOrder
    codesInOrder.sort((a, b) => {
        return RouteOrder.indexOf(a) - RouteOrder.indexOf(b);
    });

    // // Filter out postal codes not in RouteOrder
    const codesNotInOrder = postalcode_array.filter(code => !RouteOrder.includes(code));

    // // Combine codes in order with codes not in order
    const output = codesInOrder.concat(codesNotInOrder);
    // Fetch latitude and longitude for each postal code in the output array
    try {
        const locations = await MapLocation.find({ Postcode: { $in: output } }).sort({ $natural: 1 });
        const result = output.map(postcode => {
            const location = locations.find(loc => loc.Postcode === postcode);
            if (location) {
                return {
                    Postcode: location.Postcode,
                    Latitude: location.Latitude,
                    Longitude: location.Longitude
                };
            }
            return null;
        });
        console.log(result);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving location data', error: error.message });
    }
};

module.exports= {helloServer, getOrderBasedOnRouteID};