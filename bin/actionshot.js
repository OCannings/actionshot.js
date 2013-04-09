#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var actionshot = path.join(path.dirname(fs.realpathSync(__filename)), '../actionshot.js');
require(actionshot);
