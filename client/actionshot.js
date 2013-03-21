(function() {
  "use strict";

  var ActionShot;
  window.ActionShot = ActionShot = {};

  ActionShot.capture = function() {
    if (window.callPhantom) {
      var poll = setInterval(function() {
        window.callPhantom("actionshot:capture");
      }, 100);
    }
  }

}).call(this);
