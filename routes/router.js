const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controller")

router.get('/', controllers.helloServer);
router.post("/route-order",controllers.getOrderBasedOnRouteID)

module.exports = router;