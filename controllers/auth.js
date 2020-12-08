const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')

const io = require('../socket');

const User = require('../models/user')

const hash =12;
const privateKey = "this_is_tarun";
/** using the promise */
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

    bcrypt
      .hash(password, hash)
      .then((hashPw) => {
        const user = new User({
          email,
          name,
          password: hashPw,
        });
        return user.save();
      })
      .then((user) => {
        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
          },
          privateKey,
          { expiresIn: "1h" }
        );
        io.getIO().emit('user-added', {});
        res.status(201)
        .json({
          user,
          token
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });

}


/** using the async await */
/** I have some question here :) */
exports.login = async  (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password.toString() ;
        try{
            const loadedUser = await User.findOne({ where: { email} });
            User.findOne({ where: { email } }).then(user => {
                console.log('inside then block')
                console.log(user)
            });
            console.log(loadedUser);
            if(!loadedUser) {
                const error = new Error("User not found");
                error.statusCode = 401;
                error.data = [];
                throw error;
            }
            const compareResult = bcrypt.compareSync(password, loadedUser.password);
            if (!compareResult) {
              const error = new Error("Wrong password!");
              error.statusCode = 401;
              error.data = [];
              throw error;
            }
            const token = jwt.sign(
              {
                userId: loadedUser.id,
                email: loadedUser.email,
              },
              privateKey,
              { expiresIn: "1h" }
            );
            let newUserObj = {...loadedUser}
            delete newUserObj.password;
            newUserObj.token = token;
            console.log(delete loadedUser.password);
            io.getIO().emit("user-added", {});
            res.status(200).json({ user: loadedUser, token, newUserObj });
        }
        catch(err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
        }

};