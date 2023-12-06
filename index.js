const express = require('express');
const app = express();
const cors= require("cors");

const port = process.env.PORT || 8000; 
const router = require('./routes/router');
const { configDotenv } = require('dotenv');
configDotenv();
require("./db-connection");
//require("./db-insertion");

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  };
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});