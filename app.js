const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { STATUS_CODES } = require("http");
// Import the dotenv library to load environment variables
require("dotenv").config();

const author = process.env.AUTH;
const url = process.env.URL;

const app = express();

app.use(express.static("public")); //To access style.css and image
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: author,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      response.on("data", function (data) {
        console.log(JSON.parse(data));
      });
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Listening to port 3000.");
});
