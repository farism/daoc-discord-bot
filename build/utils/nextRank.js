'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../constants');

exports.default = function (rps) {
  var nextIndex = _constants.RANK_VALUES.findIndex(function (value) {
    return value > rps;
  });

  return _constants.RANK_VALUES[nextIndex] - rps;
};