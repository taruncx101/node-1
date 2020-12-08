const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

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

app.use('/user', userRoutes);
app.use("/auth", authRoutes);
/** error handling */
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const errors = err.data || [];
  res.status(status).json({ message, errors });
});


/** sync the tables with the db */
sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    //console.log("sequelize result", result);
  })
  .catch((err) => console.log('sequelize sync error',err));

const server = app.listen(8080);
//const io = require('socket.io')(server);
const io = require("./socket").init(server);
io.on("connection", (socket) => {
  console.log("client connected");
});