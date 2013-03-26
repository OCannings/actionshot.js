var express = require("express"),
  request = require("request"),
  exec = require("child_process").exec;

var app = express();

app.use(express.static(__dirname + '/../ajax/public'));
app.use("/client", express.static(__dirname + "/../../client/"));

app.get("/pages/:page", function(req, res) {
  request.get("http://localhost:3000/pages/" + req.params.page, function(err, response, body) {
    exec("node ../../actionshot.js http://localhost:3000/pages/" + req.params.page, function(err, stdout, stderr) {
      if (err) throw err;
      if (stderr) console.log(stderr);
      res.send(stdout);
    });
  });
});

app.listen(3001);
console.log("Listening on port 3001");
