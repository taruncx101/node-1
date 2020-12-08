const express = require('express');

const userController = require('../controllers/user')

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get('/user-list', isAuth, userController.getUsers);

module.exports = router;