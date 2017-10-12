// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

    // Each of the below routes just handles the HTML page that the user gets sent to.
    // 1. At the root path, send a simple hello world message to the browser
    app.get("/", function(req, res) {
        // res.send("Hello world");
      // Article.all(function(data) {
      //  var hbsObject = {
      //    : data
      //  };
      //  console.log(hbsObject);
       res.render("index");
     });



    // cms route loads cms.html
      app.get("/home", function(req, res) {
        res.sendFile(path.join(__dirname, "../views/view.html"));
      });
};
