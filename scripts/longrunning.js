var system = require("system"),
  page = require("webpage").create();

var start = new Date().getTime();
var urls = "contact home about modal".split(" ");
var baseUrl = "http://localhost:3000";

var nextUrl = function(includeBase) {
  if (urls.length > 0) {
    return (includeBase ? baseUrl : "") + "/pages/" + urls.pop();
  } else {
    phantom.exit();
  }
}

page.open(nextUrl(true), function (status) {
  page.onCallback = function(msg) {
    var links, html, doctype, title, stringOutput, jsonOutput = {};

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

    console.log(stringOutput + "\n");
    var now = new Date().getTime();
    console.log("Time: " + (now - start) + "ms");
    start = now;
    var next = nextUrl();
    page.evaluate(function() {
      History.pushState(null, null, arguments[0]);
    }, next);
  };
});
