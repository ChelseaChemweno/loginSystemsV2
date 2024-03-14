const express = require("express");
const mysql = require("mysql");
const path = require("path");
// configuration

const myConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginsystem",
});
//test the connection
myConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});
//Query Method
myConnection.query(
  "CREATE TABLE IF NOT EXISTS users(  usersid INT NOT NULL AUTO_INCREMENT,  email VARCHAR(255) NOT NULL,fullname VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL,PRIMARY KEY (usersid))",
  (sqlerror) => {
    if (sqlerror) {
      console.log(sqlerror);
    } else {
      console.log("Table Created");
    }
  }
);
const app = express();
app.get("/", (req, res) => {
  console.log(req.baseUrl);
  res.render("index.ejs");
});
app.use(express.static(path.join(__dirname, "public")));
app.get("/login", (req, res) => {
  // Recieve data
  //Compare credentials with what is in the database
  //if the password math --- create a session
  res.render("login.ejs");
});
app.get("/Signup", (req, res) => {
  //Recieve data from the client or the frontend
  //Input Validation
  //Hash the password
  //Save data in the database
  console.log(req.path);
  res.render("signup.ejs");
});
app.get("/About", (req, res) => {
  //This is an about page for this elearning page
  console.log(req.path);
  res.render("about.ejs");
});
app.get("/courses", (req, res) => {
  //This is a courses page for this elearning page
  console.log(req.path);
  res.render("courses.ejs");
});
app.get("/protectecRouteOne", (req, res) => {
  res.send("Only for logged in users");
});
app.get("/protectecRouteTwo", (req, res) => {
  res.send("Only for logged in users ");
});
app.get("/publicRouteOne", (req, res) => {
  res.send("For any Visitors ");
});
app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});
//start/run
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
//npm run dev ( to let the server continue runing )
//Dbeaver -  A   database plugin in that will show you the etity relationship diaghram between the different tables
