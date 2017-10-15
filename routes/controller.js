//Node Dependencies
var express = require("express");

// Scripting Tools
var cheerio = require("cheerio");
var request = require("request");

var router = express.Router();
// Initialize Express for Routing
// var app = express();

//models
var Article = require("../models/Article.js");


// module.exports = function(app) {
  // Index Page Render (first visit to site)
  router.get("/", function (req,res) {

    //Scrape Data
    res.redirect("/scrape");
  });


  router.get('/news', function (req,res) {

    //Query MongoDB for all article entries (sort newest to top, assuming Ids increment)
    Article.find().sort({_id: -1})

      //Then send them to the handlebars template to be rendered
      .exec(function(err,doc){
        //log errors
        if (err){
          console.log(err);
        }
        // or send the articles to the browser as json object
        else {
          var hbsObject = {articles: doc}
          res.render('index', hbsObject);
          //res.json(hbsObject)
        }
      });

  });

  // Web Scrape Route
    router.get("/scrape", function(req, res) {
        request("https://mwomercs.com/news", function(error, response, html) {
          // Load the HTML into cheerio and save it to a variable
          // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
          var $ = cheerio.load(html);
          // An empty array to save the data that we'll scrape
          var results = {};
          // With cheerio, find each p-tag with the "title" class
          // (i: iterator. element: the current element)
          $("p").each(function(i, element) {
            // Save the text of the element in a "title" variable
            results.title = $(element).parent().find('h2').text();
            // Save link to article
            results.link = "https://mwomercs.com" + $(element).parent().find('h2').children().attr("href");
            //Save article summary
            var summary = $(element).text();
            summary = summary.replace(/\r?\n|\r/g, " ");
            results.summary = summary;
            // Using the Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(results);
            // Save these results in an object that we'll push into the results array we defined earlier
            entry.save(function(err, doc){
              //Log any errors
              if (err) {
                console.log(err);
              }
              // Or log the doc
              else {
                console.log(doc);
              }

            });
          });
          res.redirect("/news");

      });
    // Tell the browser that we finisehd scraping the test
    // res.send("SCRAPE COMPLETE")
    });

    //
    // router.get("/save", function(req,res) {
    //   request("https://mwomercs.com/news", function(error, response, html) {
    //     // Load the HTML into cheerio and save it to a variable
    //     // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    //     var $ = cheerio.load(html);
    //     // An empty array to save the data that we'll scrape
    //     var results = [];
    //     // With cheerio, find each p-tag with the "title" class
    //     // (i: iterator. element: the current element)
    //     $("p").each(function(i, element) {
    //       // Save the text of the element in a "title" variable
    //       var title = $(element).parent().find('h2').text();
    //       // Save link to article
    //       var link = $(element).parent().find('h2').children().attr("href");
    //       //Save article summary
    //       var summary = $(element).text();
    //       summary = summary.replace(/\r?\n|\r/g, " ");
    //       // Save these results in an object that we'll push into the results array we defined earlier
    //       results.push({
    //         title: title,
    //         link: "https://mwomercs.com" + link,
    //         summary: summary
    //       });
    //     });
    //     // Log the results once you've looped through each of the elements found with cheerio
    //     console.log(results);
    //     res.render("index", results);
    //   });
    // });


  module.exports = router;

// End exports
