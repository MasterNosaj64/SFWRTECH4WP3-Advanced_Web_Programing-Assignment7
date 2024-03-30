const express = require('express');
var router = express.Router()
const UsersModel = require('../models/users.js')
const ArticlesModel = require('../models/articles.js')

// Display the editors page
router.get("/", async function (req, res) {
  // Retrieve all of the articles and users using the model method, display the page
  let articlesResults = await ArticlesModel.getAllArticles();
  req.TPL.articles = articlesResults;

  let usersResults = await UsersModel.getAllUsers();
  req.TPL.users = usersResults;

  res.render("editors",
             req.TPL);

});

// delete a user action (given an id parameter)
router.get("/deleteuser", async function (req, res) {

  try {

    await UsersModel.deleteUser(req.query.rowid);
    await ArticlesModel.deleteArticles(req.query.username);
    res.redirect("/editors");

  } catch (error) {

    console.error("Delete error:", error);
    res.redirect("/editors");

  }

});

// delete a article action (given an id parameter)
router.get("/deletearticle", async function (req, res) {

  try {

    await ArticlesModel.deleteArticle(req.query.rowid);
    res.redirect("/editors");

  } catch (error) {

    console.error("Delete error:", error);
    res.redirect("/editors");

  }

});

module.exports = router;
