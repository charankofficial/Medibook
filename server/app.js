const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

//Dotenv config
const dotenv = require('dotenv')
dotenv.config({path: './config.env' })

//App use
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//DB - MySql - Connection
require('./db/conn'); 


//Router
const authRoute = require("./router/auth");
app.use("/", authRoute);


//Port Configuration
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
