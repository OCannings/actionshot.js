var assert = require("assert"),
  request = require("request"),
  express = require("express"),
  exec = require("child_process").exec,
  http = require("http");

describe('ActionShot JS', function(){
  before(function(done) {
    var app = express();
    app.use(express.static("./test/fixtures"));
    app.use(express.static("./client"));
    app.listen(8000);
    done();
  });

  describe('capturing dynamic content', function(){
    it('should extract the correct doctype', function(done){
      exec("node ./actionshot.js http://localhost:8000/doctype.html", function(err, stdout, stderr) {
        var doctype = stdout.match(/^.*$/m)[0];
        assert.equal(doctype, '<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">');
        done();
      });
    });

    it('should extract the correct links', function(done){
      exec("node ./actionshot.js http://localhost:8000/links.html --links", function(err, stdout, stderr) {
        assert.deepEqual(JSON.parse(stdout), ["/a", "/b", "/c"]);
        done();
      });
    });

    it('should extract the correct title', function(done){
      exec("node ./actionshot.js http://localhost:8000/links.html --title", function(err, stdout, stderr) {
        stdout = stdout.replace(/\n*$/, "");
        assert.equal(stdout, "A title");
        done();
      });
    });

    it('should extract the correct links and title', function(done){
      exec("node ./actionshot.js http://localhost:8000/links.html -lt", function(err, stdout, stderr) {
        var output = JSON.parse(stdout);
        assert.equal(output.title, "A title");
        assert.deepEqual(output.links, ["/a", "/b", "/c"]);
        done();
      });
    });

    it('should produce a JSON version of a crawled site', function(done){
      exec("node ./actionshot.js http://localhost:8000/crawl/a.html --crawl", function(err, stdout, stderr) {
        var output = JSON.parse(stdout);
        request("http://localhost:8000/crawl/output.json", function(err, res, body) {
          assert.deepEqual(output, JSON.parse(body));
          done();
        });
      });
    });

    it('should wait for all conditions to be met before capturing', function(done) {
      exec("node ./actionshot.js http://localhost:8000/conditions.html --title", function(err, stdout, stderr) {
        stdout = stdout.replace(/\n*$/, "");
        assert.equal(stdout, "Easy as 1, 2, 3.");
        done();
      });
    });

    it('should remove actionshot:ignore html comments after capturing', function(done) {
      exec("node ./actionshot.js http://localhost:8000/html-comments.html", function(err, stdout, stderr) {

        var commentBody = !!stdout.match("Hello"),
          commentOpen = !!stdout.match("<!-- actionshot:ignore"),
          commentClose = !!stdout.match("-->");

        assert.equal(commentBody, true);
        assert.equal(commentOpen, false);
        assert.equal(commentClose, false);
        done();
      });
    });
  });
});
