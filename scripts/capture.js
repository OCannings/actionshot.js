var system = require("system"),
  page = require("webpage").create(),
  args = system.args;

var url = args[1];
var browserLogs = "";

var timeout;
args.forEach(function(arg) {
  var match = arg.match(/--timeout=([\d]+)/i);
  if (match) {
    timeout = match[1];
  }
});

if (!timeout) {
  timeout = 5000;
}

var arg = function(long, short) {
  return args.indexOf(long) > 0 || args.indexOf(short) > 0;
}

var error = function(message) {
  system.stderr.writeLine(message + "\n");
  if (browserLogs) {
    system.stderr.writeLine("Browser logs:");
    system.stderr.writeLine(browserLogs);
  }
  phantom.exit(1);
}

page.customHeaders = {"X-ActionShot": "true"};

page.onConsoleMessage = function(log) {
  browserLogs += "  " + log + "\n";
}

var capture = function() {
  var links, html, doctype, title, stringOutput, jsonOutput = {};

  if (args.length <= 2 || arg("--html", "-h")) {
    html = page.evaluate(function() {
      return document.all[0].outerHTML;
    });
    doctype = page.evaluate(function() {
      var node = document.doctype;
      var doctype = "<!DOCTYPE "
               + node.name
               + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
               + (!node.publicId && node.systemId ? ' SYSTEM' : '') 
               + (node.systemId ? ' "' + node.systemId + '"' : '')
               + '>';
      return doctype;
    });
    html = doctype + "\n" + html;
    stringOutput = html;
    jsonOutput["html"] = html;
  }

  if (arg("--links", "-l")) {
    links = page.evaluate(function() {
      var links, domLinks;
      links = [];
      domLinks = document.querySelectorAll("a");
      for (var i=0;i<domLinks.length;i++) {
        var link = domLinks[i].getAttribute("href");
        if (links.indexOf(link) === -1) {
          links.push(link);
        }
      }

      return links;
    });
    stringOutput = JSON.stringify(links);
    jsonOutput["links"] = links;
  }

  if (arg("--title", "-t")) {
    title = page.evaluate(function() {
      var title = document.querySelector("title");
      return title ? title.text : "";
    });
    stringOutput = title;
    jsonOutput["title"] = title;
  }

  var output = stringOutput;
  if (Object.keys(jsonOutput).length > 1) {
    output = JSON.stringify(jsonOutput);
  }

  // filter any actionshot:ignore html comments from the output
  if (output) {
    output = output.replace(/<!--\s*actionshot:ignore\s*([\s\S]*?)\s*-->/gi, "$1");
  }

  console.log(output);

  // a defer is needed here to stop phantomjs crashing ~70% of the time
  setTimeout(function() {
    phantom.exit();
  }, 0);

}

var captured = false;
page.onCallback = function(action) {
  switch (action) {
    case "actionshot:init":
      return true;
    break
    case "actionshot:capture":
      if (!captured) {
        capture();
        captured = true;
      }
    break;
  }
}

page.open(url);

setTimeout(function() {
  error("Capture script timed out attempting to load " + url + " after " + timeout + "ms, please make sure you've included the client side JavaScript and called ActionShot.capture()");
}, timeout);
