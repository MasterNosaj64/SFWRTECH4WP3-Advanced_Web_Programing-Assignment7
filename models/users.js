const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function init() {
  try {
    db = await sqlite.open({
      filename: 'database.db',
      driver: sqlite3.Database
    });
  } catch (err) {
    console.error(err);
  }
}

init();


// select all the realtors, call the callback with them as a parameter
function getAllUsers() {
  return db.all("SELECT rowid, * FROM Users")
}


// Return the user
async function login(username, password) {
  let results;

  try {
    results = await db.all("SELECT * FROM Users WHERE username = ?", username);
    console.log(results);
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }

  if (results.length === 0) {
    return null;
  }

  const user = results[0];

  if (user.password === password) {

    return user;

  }

  return null;
}

// Return the user
async function signup(username, password) {


  if (username.length > 1 && password.length > 1) {

    try {

      await db.run("INSERT INTO Users (username, password, level) VALUES (?,?,?)", [username, password, 'member']);
      console.log("username length: "+username.length+ " | password length: "+ password.length);

    } catch (error) {

      console.error("Database error:", error);
      return null;

    }

    return true;

  } else {

    return null;
  }
}

//delete articles
async function deleteUser(rowid)
{
  await db.run("DELETE FROM Users WHERE rowid=?", rowid);
}

module.exports = {  getAllUsers, login, signup, deleteUser};
