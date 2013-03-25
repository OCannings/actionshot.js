(function() {
  "use strict";

  var ActionShot;
  window.ActionShot = ActionShot = {};

  // Is the page being captured - useful for 
  // conditional template rendering
  ActionShot.capturing = !!window.callPhantom;

  // Method for automatically stubbing methods when the page
  // isn't being fetched by PhantomJS
  var stub = function(func) {
    return ActionShot.capturing ? func : function(){};
  }

  // Disable jQuery animations
  // todo: make optional
  if (ActionShot.capturing) {
    window.jQuery && (jQuery.fx.off = true);
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
      poll = setInterval(function callPhantom() {
        window.callPhantom("actionshot:capture");
      }, 50);
      callPhantom();
    }
  });

  ActionShot.after = stub(function(condition) {
    if (this.conditions.indexOf(condition) === -1) {
      this.conditions.push(condition);
    }
  });

}).call(this);
