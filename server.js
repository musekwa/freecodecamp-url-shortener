"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var model = require("./db");
var bodyParser = require("body-parser");
var multer = require("multer");
var cors = require("cors");
var dns = require("dns");
var url = require("url");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;
var DB_URI =
  "mongodb+srv://evariste:Ssssssss12@cluster0-rbaxz.mongodb.net/test?retryWrites=true&w=majority";

/** this project needs a db !! 
a mongodb connection
**/

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected ...");
  })
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.post("/api/shorturl/new", async (req, res) => {
  const newUrl = req.body.url; //retrieved the url
  const parsedUrl = url.parse(newUrl);  //parsing the url 
  if (parsedUrl.protocol == null) {  // if the url does not have any protocol (http or https), then it isn't a valid url
    res.json({ error: "invalid URL" });
  } else {
    dns.lookup(parsedUrl.hostname, (err, address, family) => {  //check whether the hostname is a valid one
      if (err) {
        res.json({ error: "invalid URL" });
        throw err;
      }
    })

    const numOfDocuments = await model.countDocuments();

    await model.create({ url: newUrl, short: numOfDocuments + 1 });

    res.json({ original_url: newUrl, short_url: numOfDocuments + 1 });
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const short_url = req.params.short_url;

  const document = await model.findOne({ short: short_url });

  res.redirect(document.url);
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
