const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { log } = require("console");
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
  console.log(req.cookies);
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
app.use(
  session({
    secret: "jfdjks",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 6000 },
  })
);
app.use(cookieParser());
app.use((re, res, next) => {
  const protectedRoutes = [
    "/protectecRouteOne",
    "/protectecRouteTwo",
    "/profile",
  ];
  if (req.session && req.session.user) {
    req.locals.user = req.session.user;
    next();
  } else if (protectedRoutes.includes(req.path)) {
    res.status(201).send("login to access this resourse");
  } else {
    //public route-- , signup, landing,login
    next();
  }
});
app.post("/collectcookie"); // we can collect data on how much time the user spent on the webiste
app.get("/login", (req, res) => {
  if (req.query.signupSuccess) {
    res.render("login.ejs", { message: "Signup succesfull!You can now login" });
  } else {
    res.render("login.ejs");
  }
});
app.post("/login", (req, res) => {
  // Recieve data
  //Compare credentials with what is in the database
  //if the password math --- create a session
  console.log(req.body);
  const loginStatement = `SELECT email, fullname ,password FROM users WHERE email = '${req.body.email}'`;
  myConnection.query(loginStatement, (sqlErr, userData) => {
    if (sqlErr) {
      console.log(sqlErr.message);
      res.status(500).render("login.ejs", {
        message: "Server Error :Contact Admin if this persists",
      });
    } else {
      console.log(userData);
      //checks if passwords match
      if (userData.length == 0) {
        res
          .status(401)
          .render("login.ejs", { message: "email or password is invalid" });
      } else {
        if (bcrypt.compareSync(req.body.password, userData[0].password)) {
          //create a seesion
          res.cookie("user", userData[0]);
          // res.cookie("email", userData[0].email, { maxAge: 60 });
          //redirect this person to the home page
          res.redirect("/");
        } else {
          res
            .status(401)
            .render("login.ejs", { message: "email or password is invalid" });
        }
      }
    }
  });
  // res.redirect("/");
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
        // console.error(err.message); /// Log detailed error information for debugging
        res.status(500).render("signup.ejs", {
          error: true,
          errMessage: "Server Error :Contact Admin",
          prevInput: req.body,
        }); // Send a descriptive error status code
      } else {
        res.status(304).redirect("/login?signupSuccess=true"); // Indicate success with appropriate status code
      }
    });
  } else {
    res.render("signup.ejs", {
      error: true,
      errMessage: "password and confirm password do not match",
      prevInput: req.body,
    });
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
// Check on the login and the seesions (cooie id ) the module is not found. How to check if the module has been installed
//Introudction  of the parking management systems
