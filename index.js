const express = require('express');
const app = express();
const cors= require("cors");

const port = process.env.PORT || 8000; 
const router = require('./routes/router');
const { configDotenv } = require('dotenv');
configDotenv();
require("./db-connection");
//require("./db-insertion");

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});