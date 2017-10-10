// Dependencies
var express = require("express");
var mongojs = require("mongojs");

// Initialize Express
var app = express();

// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// Routes
// =============================================================

require("./controllers/index.js")(app);


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
