(function() {
  "use strict";

  var ActionShot, root = this;
  root.ActionShot = ActionShot = {};

  // Is the page being captured - useful for
  // conditional template rendering
  ActionShot.capturing = ActionShot.fallback = !!root.callPhantom;

  // Method for automatically stubbing methods when the page
  // isn't being fetched by PhantomJS
  var stub = function(func) {
    return ActionShot.capturing ? func : function(){};
  }

  // Disable jQuery animations
  // todo: make optional
  if (ActionShot.capturing) {
    root.jQuery && (jQuery.fx.off = true);
  }

  // Conditions which need to be met before a capture will take place
  ActionShot.conditions = [];

  ActionShot.capture = stub(function(condition) {
    var poll, conditionIndex;

    conditionIndex = this.conditions.indexOf(condition);
    if (conditionIndex !== -1) {
      this.conditions.splice(conditionIndex, 1);
    }

    if (this.conditions.length === 0) {
      /*poll = setInterval(function callPhantom() {
        root.callPhantom("actionshot:capture");
      }, 50);*/
      setTimeout(callPhantom, 0);
    }
  });

  ActionShot.after = stub(function(condition) {
    if (this.conditions.indexOf(condition) === -1) {
      this.conditions.push(condition);
    }
  });

}).call(this);

/*
if (ActionShot.capturing) {
  document.write("<style id='as-override'> .as-hide { display: none !important }</style>");
} else {
  setTimeout(function() {
    var el = document.getElementById("as-override");
    el.parentNode.removeChild(el);
  }, 0);
}
*/
