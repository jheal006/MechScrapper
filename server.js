// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scripting Tools
var cheerio = require("cheerio");
var request = require("request");

//Require Models
var Aricle = require("./models/Article.js");

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


// Routes
// =============================================================

require("./routes/news.js")(app);


// First, tell the console what server.js is doing
console.log("\n***********************************\n" +             "Grabbing every thread name and link\n" + "from reddit's webdev board:" + "\n***********************************\n");

// Making a request for MechWarrior Online's "news" board. The page's HTML is passed as the callback's third argument
var scraper = function() {
  request("https://mwomercs.com/news", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("p").each(function(i, element) {

      // Save the text of the element in a "title" variable
      var title = $(element).parent().find('h2').text();
      // Save link to article
      var link = $(element).parent().find('h2').children().attr("href");
      //Save article summary
      var summary = $(element).text();
      summary = summary.replace(/\r?\n|\r/g, " ");

      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: "https://mwomercs.com" + link,
        summary: summary
      });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
  });
//End of Scrapper
};

module.exports.scraper = scraper;

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
