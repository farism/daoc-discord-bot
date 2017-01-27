'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HERALD_SEARCH_API_URL = 'http://api.camelotherald.com/character/search';
var HERALD_INFO_API_URL = 'http://api.camelotherald.com/character/info';
var EXCIDIO_API_URL = 'http://heraldapi.excidio.net/character/info';

var searchByNameAndCluster = function searchByNameAndCluster(name, cluster) {
  console.log('Searching camelot herald for \'' + name + '\' on \'' + cluster + '\'');

  return new _bluebird2.default(function (resolve, reject) {
    (0, _requestPromise2.default)({
      uri: '' + HERALD_SEARCH_API_URL,
      json: true,
      qs: {
        name: name,
        cluster: cluster
      }
    }).then(function (response) {
      if (response.results.length) {
        console.log('Fetched ' + response.results.length + ' results from herald successfully');

        resolve(response.results);
      } else {
        reject('Could not find any characters matching name \'' + name + '\'');
      }
    }).catch(function (err) {
      console.log(err);
    });
  });
};

var getMatchingCharacterId = function getMatchingCharacterId(name, results) {
  console.log('Search for matching character with name \'' + name + '\'');

  return new _bluebird2.default(function (resolve, reject) {
    var character = results.find(function (char) {
      return char.name.split(' ')[0] === name;
    });

    resolve((character || results[0]).character_web_id);
  });
};

var fetchCharacterFromHerald = function fetchCharacterFromHerald(id) {
  console.log('Fetch character stats from herald for id \'' + id + '\'');

  return new _bluebird2.default(function (resolve, reject) {
    (0, _requestPromise2.default)({
      uri: HERALD_INFO_API_URL + '/' + id,
      json: true
    }).then(function (response) {
      console.log('Fetched character from camelot herald successfully');

      resolve(_extends({}, response.realm_war_stats.current.player_kills.total, {
        realm_points: response.realm_war_stats.current.realm_points
      }));
    }).catch(function (err) {
      console.log(err);
    });
  });
};

var fetchCharacterFromExcidio = function fetchCharacterFromExcidio(id, heraldStats) {
  console.log('Fetch character stats from excidio for id \'' + id + '\'');

  return new _bluebird2.default(function (resolve, reject) {
    (0, _requestPromise2.default)({
      uri: EXCIDIO_API_URL + '/' + id,
      json: true
    }).then(function (response) {
      console.log('Fetched character from excidio successfully');

      resolve(response);
    }).catch(function (err) {
      console.log(err);
    });
  });
};

var reply = function reply(heraldStats, excidioStats) {
  var realm_points = heraldStats.realm_points;
  var live = excidioStats.live,
      week = excidioStats.week;


  return '\n```\n-------------------------\nCHARACTER\n-------------------------\nName         ' + (live.name || '') + '\nClass        ' + (live.level || '') + ' ' + (live.race_name || '') + ' ' + (live.class_name || '') + '\nRank         ' + (0, _utils.displayRank)(realm_points) + '\nNext Rank    ' + (0, _utils.formatNumber)((0, _utils.nextRank)(realm_points)) + '\n\n-------------------------\nALL TIME\n-------------------------\n' + printAll(heraldStats) + '\n\n-------------------------\nLAST WEEK\n-------------------------\n' + printLastWeek(week) + '\n\n-------------------------\nTHIS WEEK\n-------------------------\n' + printThisWeek(heraldStats, live) + '\n```\n';
};

var hasStats = function hasStats(stats) {
  return stats.kills || stats.death_blows || stats.solo_kills || stats.deaths;
};

var printStats = function printStats(stats) {
  return 'RP           ' + (0, _utils.formatNumber)(stats.realm_points) + '\nKills        ' + (0, _utils.formatNumber)(stats.kills) + '\nDeathblows   ' + (0, _utils.formatNumber)(stats.death_blows) + '\nSolo Kills   ' + (0, _utils.formatNumber)(stats.solo_kills) + '\nDeaths       ' + (0, _utils.formatNumber)(stats.deaths) + '\nIRS          ' + (0, _utils.formatIRS)(stats.realm_points / (stats.deaths || 1));
};

var printAll = function printAll(herald) {
  return printStats(herald);
};

var printLastWeek = function printLastWeek(excidio) {
  var stats = {
    realm_points: excidio.realm_points,
    kills: excidio.player_kills_total_kills,
    death_blows: excidio.player_kills_total_deaths,
    solo_kills: excidio.player_kills_total_solo_kills,
    deaths: excidio.player_kills_total_deaths
  };

  if (hasStats(stats)) {
    return printStats(stats);
  } else {
    return 'No recent stats';
  }
};

var printThisWeek = function printThisWeek(herald, excidio) {
  var stats = {
    realm_points: herald.realm_points - excidio.realm_points,
    kills: herald.kills - excidio.player_kills_total_kills,
    death_blows: herald.death_blows - excidio.player_kills_total_death_blows,
    solo_kills: herald.solo_kills - excidio.player_kills_total_solo_kills,
    deaths: herald.deaths - excidio.player_kills_total_deaths
  };

  if (hasStats(stats)) {
    return printStats(stats);
  } else {
    return 'No recent stats';
  }
};

exports.default = function (message) {
  var _message$split = message.split(' '),
      _message$split2 = _slicedToArray(_message$split, 3),
      _message$split2$ = _message$split2[0],
      command = _message$split2$ === undefined ? '' : _message$split2$,
      _message$split2$2 = _message$split2[1],
      name = _message$split2$2 === undefined ? '' : _message$split2$2,
      _message$split2$3 = _message$split2[2],
      cluster = _message$split2$3 === undefined ? 'Ywain' : _message$split2$3;

  return new _bluebird2.default(function (resolve, reject) {
    searchByNameAndCluster(name, cluster).then(function (results) {
      return getMatchingCharacterId(name, results);
    }).then(function (id) {
      return _bluebird2.default.all([fetchCharacterFromHerald(id), fetchCharacterFromExcidio(id)]);
    }).spread(function (herald, excidio) {
      try {
        resolve(reply(herald, excidio));
      } catch (e) {
        console.error(e);
      }
    }).catch(function (err) {
      try {
        reject(err);
      } catch (e) {
        console.error(e);
      }
    });
  });
};