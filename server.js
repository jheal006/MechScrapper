// Node Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Require Models
// var Article = require("./models/Article.js");

// Scripting Tools
var cheerio = require("cheerio");
var request = require("request");

// set mongoose to leverage built in JS ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Set Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Routes
// =============================================================
// require("./routes/html-routes.js")(app);
var router = require("./routes/controller.js");
app.use("/", router);

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
