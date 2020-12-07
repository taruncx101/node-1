const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.signup = (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.data = errors.array();
        error.statusCode = 422;
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then((hashPw) => {
            const user = new User({
                email,
                name,
                password: hashPw,
            });
            return user.save();
        })
        .then(user => {
            res.json({
                user
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


exports.login = (req, res, next) => {
    
};