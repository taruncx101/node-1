const express = require('express');

const userController = require('../controllers/user')


const router = express.Router();

router.get('/user-list', userController.getUsers);

module.exports = router;