var fs = require("fs");

var page = require('webpage').create();
var url = 'http://localhost:3000/home';

page.open(url, function (status) {
  page.onCallback = function(msg) {
    var html = page.evaluate(function() {
      return document.all[0].outerHTML;
    });
    f
    phantom.exit();
  };
});
