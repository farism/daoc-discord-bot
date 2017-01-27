'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _levenshtein = require('levenshtein');

var _levenshtein2 = _interopRequireDefault(_levenshtein);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (message) {
  var input = message.replace('!rank ', '').toLowerCase();

  var closest = null;
  var level = null;
  var rank = '';

  _constants.RANK_TITLES.forEach(function (tier, i) {
    tier.forEach(function (title) {
      var distance = new _levenshtein2.default(title.toLowerCase(), input).distance;

      if (closest === null || distance < closest) {
        closest = distance;
        level = i;
        rank = title;
      }
    });
  });

  return new Promise(function (resolve, reject) {
    if (rank && level && closest <= 5) {
      var rankValueIndex = level * 10 || 1;
      var requiredRPs = (0, _numeral2.default)(_constants.RANK_VALUES[rankValueIndex]).format('0,0');

      resolve('\'' + rank + '\' is RR ' + (level + 1) + 'L0, achievable at ' + requiredRPs + ' rps');
    } else {
      reject('Could not find rank, please check spelling');
    }
  });
};