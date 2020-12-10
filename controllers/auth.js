const axios = require("axios");
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
        return User.create({
          email,
          name,
          password: hashPw,
        });
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
exports.login = async  (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password.toString() ;
        try{
            const loadedUser = await User.findOne({ where: { email} });
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
            console.log(delete loadedUser.password);
            io.getIO().emit("user-logged-in", {});
            res.status(200).json({ user: loadedUser, token });
        }
        catch(err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
        }

};

exports.googleLogIn = async (req, res, next) => {
  try {
    const googleAuthToken = req.query.google_auth_token;
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleAuthToken}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      const error = new Error("User not found");
      error.statusCode = 401;
      error.data = [];
      throw error;
    }
    const { data } = response;
    const { email } = data;
    const { name } = data;
    /** this is for now only, we have to make password field nullable and we can also add some other field to track google login */
    const password = '12345';
    /** need to check the  user alreeady exist or not*/
    let user = await User.findOne({ where: { email } });
    let eventType = "user-logged-in";
    if (!user) {
      const hashPw = bcrypt.hashSync(password, hash);
      user = await User.create({
        email,
        name,
        password: hashPw,
      });
      eventType = "user-added";
    }
    console.log({ user });
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      privateKey,
      { expiresIn: "1h" }
    );
    io.getIO().emit("eventType", {});
    res.status(200).json({ user, token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};