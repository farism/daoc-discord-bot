'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../constants');

exports.default = function (rps) {
  var baseRank = _constants.RANK_VALUES.findIndex(function (value) {
    return rps <= value;
  });
  var primaryRank = Math.max(1, Math.floor((baseRank + 10) / 10));
  var secondaryRank = Math.max(0, baseRank % 10 - 1);

  return primaryRank + 'L' + secondaryRank;
};