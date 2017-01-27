'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _constants = require('../constants');

var reply = function reply(message) {
  return '\n```\n' + message + '\n```\n';
};

exports.default = function (message) {
  var _message$split = message.split(' '),
      _message$split2 = _slicedToArray(_message$split, 2),
      _message$split2$ = _message$split2[0],
      command = _message$split2$ === undefined ? '' : _message$split2$,
      _message$split2$2 = _message$split2[1],
      target = _message$split2$2 === undefined ? '' : _message$split2$2;

  return new Promise(function (resolve, reject) {
    if (target) {
      resolve(reply(_constants.HELP[target]));
    } else {
      resolve(reply(Object.keys(_constants.HELP).map(function (key) {
        return _constants.HELP[key];
      }).join('\n\n')));
    }
  });
};