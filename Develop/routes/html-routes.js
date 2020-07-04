// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

module.exports = function(app) {

  //routes to app index/homepage
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  //routes to exercise page
  app.get("/exercise", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/exercise.html"));
  });

  //routes to stats page
  app.get("/stats", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/stats.html"));
  });

};
