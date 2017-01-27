'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../constants');

exports.default = function (message) {
  var title = message.replace('!title ', '');

  return new Promise(function (resolve, reject) {
    var value = _constants.TITLES[title.toLowerCase()];

    if (value) {
      resolve(value + ' to obtain title \'' + title + '\'');
    } else {
      reject('Title \'' + title + '\' does not exist');
    }
  });
};