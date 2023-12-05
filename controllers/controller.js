const routeArray = require("../models/routeArraySchema");
const MapLocation = require("../models/mapLocationSchema");

const helloServer = (req,res) => {
    return res.send("Hello, server running!");
}

// const getOrderBasedOnRouteID = async(req,res) => {
//     try {
//     const { route, postalcode_array } = req.body;
//     const foundRoute = await routeArray.findOne({ Route: route });

//     if (!foundRoute) {
//       return res.status(404).json({ message: 'Route not found' });
//     }
//     const RouteOrder =  foundRoute.RouteOrder;
//     const indexMap = new Map();
//     RouteOrder.forEach((code, index) => {
//         indexMap.set(code, index);
//     });

//     // Sort postalcode_array based on their index in RouteOrder
//     postalcode_array.sort((a, b) => {
//         const indexA = indexMap.get(a);
//         const indexB = indexMap.get(b);
//         if (indexA === undefined && indexB === undefined) {
//             return 0; // If both elements are not in RouteOrder, maintain their order
//         } else if (indexA === undefined) {
//             return 1; // If only one element is in RouteOrder, keep it first
//         } else if (indexB === undefined) {
//             return -1; // If only one element is in RouteOrder, keep it first
//         } else {
//             return indexMap.get(a) - indexMap.get(b);
//         }
//     });

//     // Filter out the postal codes that are not in RouteOrder and append them at the end
//     const filteredCodes = postalcode_array.filter(code => RouteOrder.includes(code));
//     const codesNotInOrder = postalcode_array.filter(code => !RouteOrder.includes(code));
//     const output = filteredCodes.concat(codesNotInOrder);

    
//         const locations = await MapLocation.find({ Postcode: { $in: output } });
//         const result = locations.map(location => ({
//             Postcode: location.Postcode,
//             Latitude: location.Latitude,
//             Longitude: location.Longitude
//         }));
//         return res.status(200).json({ result });
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving location data', error: error.message });
//     }

// }
const getOrderBasedOnRouteID = async (req, res) => {
    const { route, postalcode_array } = req.body;
    const foundRoute = await routeArray.findOne({ Route: route });

    if (!foundRoute) {
        return res.status(404).json({ message: 'Route not found' });
    }
    const RouteOrder = foundRoute.RouteOrder;

    // Filter postal codes that are in RouteOrder
    const codesInOrder = postalcode_array.filter(code => RouteOrder.includes(code));

    // Sort postal codes based on their index in RouteOrder
    codesInOrder.sort((a, b) => {
        return RouteOrder.indexOf(a) - RouteOrder.indexOf(b);
    });

    // Filter out postal codes not in RouteOrder
    const codesNotInOrder = postalcode_array.filter(code => !RouteOrder.includes(code));

    // Combine codes in order with codes not in order
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
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving location data', error: error.message });
    }
};

module.exports= {helloServer, getOrderBasedOnRouteID};