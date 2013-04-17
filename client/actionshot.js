!(function() {
  "use strict";

  var ActionShot, root = this;
  root.ActionShot = ActionShot = {};

  // Is the page being captured - useful for
  // conditional template rendering
  ActionShot.capturing = ActionShot.fallback = (root.callPhantom && root.callPhantom("actionshot:init")) || false;

  // Method for automatically stubbing methods when the page
  // isn't being fetched by PhantomJS
  var stub = function(func) {
    return ActionShot.capturing ? bind(func, ActionShot) : function(){};
  }

  var slice = Array.prototype.slice;

  // bind methods so they're always called in the context of ActionShot, thanks underscore!
  var bind = function(func, context) {
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Disable jQuery animations
  // TODO: make optional
  if (ActionShot.capturing) {
    root.jQuery && (jQuery.fx.off = true);
  }

  // Conditions which need to be met before a capture will take place
  ActionShot.conditions = [];

  // Conditions which have been met already
  ActionShot.metConditions = [];

  ActionShot.ready = stub(function(condition) {
    ActionShot.metConditions.push(condition);
  });

  ActionShot.allConditionsMet = stub(function() {
    for (var i=0; i<this.conditions.length; i++) {
      if (this.metConditions.indexOf(this.conditions[i]) === -1) {
        return false;
      }
    }
    return true;
  });

  ActionShot.capture = stub(function(condition) {
    var poll;

    if (condition !== void 0) {
      this.ready(condition);
    }

    if (this.allConditionsMet()) {
      poll = setInterval(function callPhantom() {
        root.callPhantom("actionshot:capture");
      }, 50);
      callPhantom("actionshot:capture");
    }
  });


  ActionShot.after = ActionShot.waitFor = stub(function(condition) {
    if (this.conditions.indexOf(condition) === -1) {
      this.conditions.push(condition);
    }
  });


  ActionShot.fallforward = bind(function() {
    var removeStyle = "actionshot-";
    removeStyle += this.capturing ? "fallback" : "fallforward";

    var styles = document.getElementsByTagName("style");
    var el;
    var styleCache = [];

    for (var i=0;i<styles.length;i++) {
      styleCache.push(styles[i]);
    }

    for (var i=0;i<styleCache.length;i++) {
      el = styleCache[i];
      if (el.getAttribute("class") === removeStyle) {
        el.parentNode.removeChild(el);
      }
    }
  }, ActionShot);

  // hide all elements which are fallforward only
  document.write("<style class='actionshot-fallforward'> .actionshot-fallforward { display: none !important } </style>");

  // hide all elements which are fallback only
  document.write("<style class='actionshot-fallback'> .actionshot-fallback { display: none !important } </style>");

  // calling ActionShot.fallforward(); will remove the correct style tag allowing the correct elements to become visible.

}).call(this);
