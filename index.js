var express = require("express");
const bodyParser = require("body-parser");
const articlesroute =  require("./article")
const cors = require('cors')
require('dotenv').config()

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin : '*',methods : ['GET','POST','DELETE','UPDATE','PUT','PATCH']}))

const db = require("./server/db");
db.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
});
app.get("/", function (req, res) {
  res.send("hello world")
  // res.send("hello world")
});
app.use('/articles',articlesroute)

app.listen(3000);
