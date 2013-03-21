var system = require("system"),
  page = require("webpage").create(),
  args = system.args;

var url = args[1];

page.open(url, function (status) {
  page.onCallback = function(msg) {
    var html = page.evaluate(function() {
      return document.all[0].outerHTML;
    });
    console.log(html);
    phantom.exit();
  };
});
