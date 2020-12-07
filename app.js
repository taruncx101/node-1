const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const sequelize = require("./util/database");

const User = require("./models/user");

const app = express();

app.use(bodyParser.json()); // for parsing applcation/json data

//set up cors policies
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    next();
})

app.use('/user', userRoutes)

/** sync the tables with the db */
sequelize
  //.sync({force: true})
  .sync()
  .then((result) => {
    //console.log("sequelize result", result);
  })
  .catch((err) => console.log('sequelize sync error',err));

app.listen(8080);