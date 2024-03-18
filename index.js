const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bcrypt = require("bcrypt");
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
myConnection.query("DROP TABLE users");
myConnection.query(
  "CREATE TABLE IF NOT EXISTS users(  usersid INT NOT NULL AUTO_INCREMENT,  email VARCHAR(255) NOT NULL,fullname VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL, dob DATE, PRIMARY KEY (usersid))",
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
//app.use is used to run middleware -functions -these are functions that run in every request
// app.use((req, res, next) => {
//   console.log("This is a middleware function !!!! Runs in every request ");
// });
//Middlewatre functions are used for authentication i.e make sure that requests being recieed are from logged i users , since the https is statless.
//Http is stateless it implies that every request -response cycle is completely indepenedent, even if they are from the same device
app.use(express.urlencoded({ extended: false })); //body paraser converts the body of the incoming requests into javascript object
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
app.post("/signup", (req, res) => {
  //Recieve data from the client or the frontend
  //Inut validation
  //Hash the password
  // Save the data in the DB
  console.log(req.body);
  if (req.body.password === req.body.confirm_password) {
    let sqlStatement = `INSERT INTO users(email,fullname,password,phone,dob)VALUES("${
      req.body.email
    }","${req.body.fullname}","${bcrypt.hashSync(req.body.password, 5)}","${
      req.body.phone
    }" ,"${req.body.dob}")`;

    //proceed
    myConnection.query(sqlStatement, (err, results) => {
      // Use consistent error variable naming
      if (err) {
        console.error(err.message); /// Log detailed error information for debugging
        res.status(500).send("Internal Server Error"); // Send a descriptive error status code
      } else {
        res.status(201).send("SignUp Success"); // Indicate success with appropriate status code
      }
    });
  } else {
    res.send("passwords dont match");
  }
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
//A middleware allows some actions to take place during the req and response action (Security , Data Transformation,caching , load balanaing)
//Installing nodemon globall npm i -g nodemon
//Installing for hashing the passwords
//Different types of Encrytion
//Async or await callbacks happen when there are too many callbacks
