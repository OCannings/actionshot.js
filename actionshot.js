var exec = require("child_process").exec,
  argv = require("optimist").argv,
  _ = require("underscore"),
  Url = require("url"),
  fs = require("fs");

if (argv.v || argv.version) {
  console.log(JSON.parse(fs.readFileSync(__dirname + "/package.json")).version);
  process.exit();
}

const DEBUG = (argv.d || argv.debug || false);

var url = argv._[0],
  output = argv._[1],
  crawl = argv.crawl;

var baseUrl = Url.parse(url);
baseUrl = baseUrl.protocol + "//" + baseUrl.host;

var error = function(message) {
  console.error("ActionShot finished with errors:");
  message && console.error(message);
}

var links = [];
var used = [];
var pages = {};

var captureUrl = function(url) {
  if (DEBUG) {
    console.log("Capturing " + url + "...");
  }

  var start = new Date().getTime();

  var callback = function(err, stdout, stderr) {
    if (stderr) {
      error(stderr);
    }

    var data = stdout.toString();

    if (crawl) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        error("Invalid JSON returned from capture script:\n" + data);
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

  var phantomArgs = ["phantomjs", __dirname + "/scripts/capture.js", url];

  if (crawl) {
    phantomArgs = phantomArgs.concat(["--html", "--links", "--title"]);
  } else {
    "links html title".split(" ").forEach(function(code) {
      if (argv[code] || argv[code[0]]) {
        phantomArgs.push("-" + code[0]);
      }
    });
  }

  if (argv.timeout) {
    phantomArgs.push("--timeout=" + argv.timeout);
  }

  phantomArgs = phantomArgs.join(" ");
  phantomArgs = [phantomArgs, callback]
  var capture = exec.apply(this, phantomArgs);
};

captureUrl(url);
