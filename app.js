const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.json()); // for parsing applcation/json data

app.use('/user', userRoutes)

app.listen(8080);