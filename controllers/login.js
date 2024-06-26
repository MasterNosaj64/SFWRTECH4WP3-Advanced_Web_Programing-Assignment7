const express = require('express');
var router = express.Router()
const UsersModel = require('../models/users.js')

// Displays the login page
router.get("/", async function (req, res) {
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function (req, res) {

  try {

    const user = await UsersModel.login(req.body.username, req.body.password);

    if (user != null) {
      // set a session key username to login the user
      req.session.username = user.username;
      req.session.level = user.level;

      if (user.level === 'editor') {
        res.redirect("/editors");
      }
      else {      // re-direct the logged-in user to the members page
        res.redirect("/members");
      }

    } else {
      // if we have an error, reload the login page with an error
      req.session.login_error = "Invalid username and/or password!";
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.session.login_error = "A fatal error occurred. Please inform your system administrator.";
    res.redirect("/login");
  }
});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function (req, res) {
  delete (req.session.username);
  delete (req.session.level);
  res.redirect("/home");
});

module.exports = router;
