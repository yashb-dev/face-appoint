var express = require("express");
var config = require("./config");
var auth = require("./auth.js")(config);
var bodyParser = require("body-parser");
var multer = require("multer");
var session = require("cookie-session");
var data = require("./data.js")(config);

/* Configure Express web application */
var app = express();
app.use(session({ signed: true, secret: config.cookieSecret }));
app.use(multer().none());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "jade");
app.enable("trust proxy");

app.get("/", function(req, res, next) {
  res.render("index", { page_id: "main" });
});

app.post("/login", function(req, res, next) {
  auth.getUser(req.body, function(err, user) {
    if (err) next(err);
    req.session.user = user;
    res.redirect("/dashboard");
  });
});

app.get("/signout", function(req, res) {
  req.session = null;
  res.redirect("/");
});

app.get("/register", function(req, res) {
  res.render("index", { page_id: "register" });
});

app.post("/register", function(req, res, next) {
  data.register(req.body, function(err, user) {
    if (err) next(err);
    req.session.user = user;
    res.redirect("/dashboard");
  });
});

app.get("/dashboard", function(req, res, next) {
  data.getItems(req.session.user, function(err, apts) {
    var appointments = apts;
    res.render("index", {
      page_id: "dashboard",
      user: req.session.user,
      items: appointments
    });
  });
});

app.get("/book", function(req, res, next) {
  res.render("index", { page_id: "book_search", user: req.session.user });
});

app.post("/book", function(req, res, next) {
  data.getService(req.body, function(err, search_results) {
    if (err) next(err);
    var results = search_results;
    res.render("index", {
      page_id: "book_results",
      user: req.session.user,
      items: results
    });
  });
});

app.post("/user", function(req, res, next) {
  data.getProfile(req.body.user, function(err, user) {
    if (err) next(err);
    var lookup_user = user;
    data.getItems(lookup_user, function(err, appointments) {
      if (err) next(err);
      var apts = appointments;
      res.render("index", {
        page_id: "user_profile",
        user: req.session.user,
        item: lookup_user,
        items: apts
      });
    });
  });
});

app.get('/about', function(req,res,next){
  res.render('index', {page_id:'about'});
});

app.post("/request", function(req, res, next) {
  data.submitRequest(req.body, function(err, ID) {
    if (err) next(err);
    res.redirect("/dashboard");
  });
});

/* Run web application */
app.listen(8080);

console.log("Running on http://localhost:8080/");
