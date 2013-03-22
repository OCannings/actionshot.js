var spawn = require("child_process").spawn,
  argv = require("optimist").argv,
  fs = require("fs");

var start = new Date().getTime();
var capture = spawn("phantomjs", [__dirname + "/scripts/capture.js", process.argv[2]]);

capture.stdout.on("data", function (data) {
  if (argv.o) {
    console.log("Capture complete (" + (new Date().getTime() - start) + ")");
    fs.writeFile(argv.o, data, function(err) {
      if (err) throw err;
    });
  } else {
    console.log(data.toString());
  }
});

capture.stderr.on("data", function (data) {
  if (argv.o) {
    console.log("stderr: " + data);
  }
});

capture.on("close", function (code) {
  if (argv.o) {
    console.log("File saved (" + (new Date().getTime() - start) + ")");
  }
});
