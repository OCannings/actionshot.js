(function() {
  "use strict";

  var ActionShot;
  window.ActionShot = ActionShot = {};

  ActionShot.static = !!window.callPhantom;

  ActionShot.capture = function() {
    if (this.static) {
      var poll = setInterval(function() {
        window.callPhantom("actionshot:capture");
      }, 100);
    }
  };

}).call(this);
