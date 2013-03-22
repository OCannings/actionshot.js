var express = require("express");
var fs = require("fs");

var app = express();

app.use(express.static(__dirname + '/public'));
app.use("/client", express.static(__dirname + "/../../client/"));

app.get("/:file", function(req, res) {
  var dir, file;
  file = req.params.file + ".html";

  dir = __dirname + "/cache/";
  fs.exists(dir + file, function(exists) {
    if (!exists) {
      console.log(dir + file + " is not cached, serving index.html");
      file = "index.html";
      dir = __dirname + "/public/";
    } else {
      console.log("Cached, nice job!");
    }
    var page = fs.readFileSync(dir + file, "utf8")
    res.send(page);
  });
});

app.listen(3000);
console.log("Listening on port 3000");
