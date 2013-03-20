var page = require('webpage').create();
var url = 'http://localhost:3000/index.html';
page.open(url, function (status) {
  page.onCallback = function(msg) {
    var html = page.evaluate(function() {
      return document.all[0].outerHTML;
    });
    console.log(html);
    phantom.exit();
  };
});
