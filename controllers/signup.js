const express = require('express');
var router = express.Router()
const UsersModel = require('../models/users.js')

// Displays the sign-up page
router.get("/", async function (req, res) {
  // if we had an error during form submit, display it, clear it from session
  req.TPL.signup_error = req.session.signup_error;
  req.session.signup_error = "";
  // if we had success during form submit, display it, clear it from session
  req.TPL.signup_success = req.session.signup_success;
  req.session.signup_success = "";

  // render the sign-up  page
  res.render("signup", req.TPL);
});

// Attempts to sign-up a user
// - The action for the form submit on the sign-up page.
router.post("/attemptsignup", async function (req, res) {

  try {

    const user = await UsersModel.signup(req.body.username, req.body.password);

    if (user != null) {

      req.session.signup_success = '<strong>User account created!</strong> <a href="./login">Login</a> to access your new account.'
      res.redirect("/signup");

    } else {
      // if we have an error, reload the login page with an error
      req.session.signup_error = "username/password cannot be blank!";
      res.redirect("/signup");
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    req.session.signup_error = "A fatal error occurred. Please inform your system administrator.";
    res.redirect("/signup");
  }
});

module.exports = router;
