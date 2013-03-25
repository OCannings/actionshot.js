var exec = require("child_process").exec,
  argv = require("optimist").argv,
  _ = require("underscore"),
  Url = require("url"),
  fs = require("fs");

var url = argv._[0],
  output = argv._[1],
  crawl = argv.crawl;

var baseUrl = Url.parse(url);
baseUrl = baseUrl.protocol + "//" + baseUrl.host;

var links = [];
var used = [];
var pages = {};

var captureUrl = function(url) {
  var start = new Date().getTime();
  var phantomArgs = ["phantomjs", __dirname + "/scripts/capture.js", url];

  if (crawl) {
    phantomArgs = phantomArgs.concat(["--html", "--links", "--title"]);
  }

  var callback = function(err, stdout, stderr) {
    var data = stdout.toString();

    if (crawl) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log(data);
        console.log("ERROR LOL");
      }
      links = links.concat(data.links);

      var parsedUrl = Url.parse(url),
        path = parsedUrl.path + (parsedUrl.hash || "");

      pages[path] = data;
      used.push(path);
      links = _.unique(_.difference(links, used));
      if (links.length > 0) {
        captureUrl(baseUrl + links[0]);
        return;
      } else {
        data = JSON.stringify(pages);
      }
    }

    if (output) {
      console.log("Capture complete (" + (new Date().getTime() - start) + ")");
      fs.writeFile(output, data, function(err) {
        if (err) throw err;
      });
    } else {
      console.log(data);
    }
  };

  phantomArgs = phantomArgs.join(" ");
  phantomArgs = [phantomArgs, callback]
  var capture = exec.apply(this, phantomArgs);
};

captureUrl(url);
