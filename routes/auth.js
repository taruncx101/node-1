const express = require("express");

const authController = require("../controllers/auth");

const User = require("../models/user");

const { body } = require("express-validator");

const router = express.Router();

router.post("/login", authController.login);
router.get("/google-login", authController.googleLogIn);
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userDoc) => {
          console.log({userDoc});
          if (userDoc) {
            return Promise.reject("The email already exists.");
          }
        });
      })
        .normalizeEmail(),
      
    body("name").trim().notEmpty(),
    
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .trim(),
  ],
  authController.signup
);

module.exports = router;
