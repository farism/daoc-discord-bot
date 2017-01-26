'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var BOT_TOKEN = process.env.BOT_TOKEN;

var HERALD_API_URL = 'http://api.camelotherald.com/character/search';
var EXCIDIO_API_URL = 'http://heraldapi.excidio.net/character/info';
var RANKS = [1, 1, 25, 125, 350, 750, 1375, 2275, 3500, 5100, 7125, 9625, 12650, 16250, 20475, 25375, 31000, 37400, 44625, 52725, 61750, 71750, 82775, 94875, 108100, 122500, 138125, 155025, 173250, 192850, 213875, 236375, 260400, 286000, 313225, 342125, 372750, 405150, 439375, 475475, 513500, 553500, 595525, 639625, 685850, 734250, 784875, 837775, 893000, 950600, 1010625, 1073125, 1138150, 1205750, 1275975, 1348875, 1424500, 1502900, 1584125, 1668225, 1755250, 1845250, 1938275, 2034375, 2133600, 2236000, 2341625, 2450525, 2562750, 2678350, 2797375, 2919875, 3045900, 3175500, 3308725, 3445625, 3586250, 3730650, 3878875, 4030975, 4187000, 4347000, 4511025, 4679125, 4851350, 5027750, 5208375, 5393275, 5582500, 5776100, 5974125, 6176625, 6383650, 6595250, 6811475, 7032375, 7258000, 7488400, 7723625, 7963725, 8208750, 9111713, 10114001, 11226541, 12461460, 13832221, 15353765, 17042680, 18917374, 20998286, 23308097, 25871988, 28717906, 31876876, 35383333, 39275499, 43595804, 48391343, 53714390, 59622973, 66181501, 73461466, 81542227, 90511872, 100468178, 111519678, 123786843, 137403395, 152517769, 169294723, 187917143];

var searchByNameAndCluster = _ramda2.default.curry(function (name, cluster) {
  console.log('Searching camelot herald for \'' + name + '\' on \'' + cluster + '\'');

  return new Promise(function (resolve, reject) {
    (0, _requestPromiseNative2.default)({
      uri: '' + HERALD_API_URL,
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
});

var getMatchingCharacterId = function getMatchingCharacterId(name, results) {
  console.log('Search for matching character with name \'' + name + '\'');

  return new Promise(function (resolve, reject) {
    var character = results.find(function (char) {
      return char.name.split(' ')[0] === name;
    });

    resolve((character || results[0]).character_web_id);
  });
};

var fetchCharacterFromExcidio = function fetchCharacterFromExcidio(id) {
  console.log('Fetch character stats from excidio for id \'' + id + '\'');

  return new Promise(function (resolve, reject) {
    (0, _requestPromiseNative2.default)({
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

var displayRank = function displayRank(rps) {
  var baseRank = RANKS.findIndex(function (value) {
    return rps <= value;
  });
  var primaryRank = Math.max(1, Math.floor((baseRank + 10) / 10));
  var secondaryRank = Math.max(0, baseRank % 10 - 1);

  return primaryRank + 'L' + secondaryRank;
};

var nextRank = function nextRank(rps) {
  var nextIndex = RANKS.findIndex(function (value) {
    return value > rps;
  });

  return RANKS[nextIndex] - rps;
};

var formatNumber = function formatNumber(value) {
  return (0, _numeral2.default)(value).format('0,0');
};

var formatIRS = function formatIRS(value) {
  return (0, _numeral2.default)(value).format('0,0.00');
};

var reply = function reply(_ref) {
  var live = _ref.live,
      week = _ref.week;
  return '\n`\n---------\nCHARACTER\n---------\nName         ' + (week.name || live.name) + '\nClass        ' + (week.class_name || live.class_name) + '\nRace         ' + (week.race_name || live.race_name) + '\nRank         ' + displayRank(live.realm_points) + ' - ' + formatNumber(live.realm_points) + '\n---------\nALL TIME\n---------\nKills        ' + formatNumber(live.player_kills_total_kills) + '\nDeathblows   ' + formatNumber(live.player_kills_total_death_blows) + '\nSolo Kills   ' + formatNumber(live.player_kills_total_solo_kills) + '\nDeaths       ' + formatNumber(live.player_kills_total_deaths) + '\nIRS          ' + formatIRS(live.realm_points / live.player_kills_total_deaths) + '\n---------\nLAST WEEK\n---------\nKills        ' + formatNumber(week.player_kills_total_kills || 0) + '\nDeathblows   ' + formatNumber(week.player_kills_total_death_blows || 0) + '\nSolo Kills   ' + formatNumber(week.player_kills_total_solo_kills || 0) + '\nDeaths       ' + formatNumber(week.player_kills_total_deaths || 0) + '\nIRS          ' + formatIRS(week.realm_points / week.player_kills_total_deaths) + '\n`\n';
};

var bot = new _discord2.default.Client();

bot.on('ready', function () {
  console.log('I am ready!');
});

bot.on('message', function (message) {
  var _message$content$spli = message.content.split(' '),
      _message$content$spli2 = _slicedToArray(_message$content$spli, 3),
      command = _message$content$spli2[0],
      name = _message$content$spli2[1],
      _message$content$spli3 = _message$content$spli2[2],
      cluster = _message$content$spli3 === undefined ? 'Ywain' : _message$content$spli3;

  if (command === '!stats') {
    searchByNameAndCluster(name, cluster).then(function (results) {
      return getMatchingCharacterId(name, results);
    }).then(function (id) {
      return fetchCharacterFromExcidio(id);
    }).then(function (character) {
      try {
        message.channel.sendMessage(reply(character));
      } catch (e) {
        console.log(e);
      }
    }).catch(function (err) {
      message.channel.sendMessage(err);
    });
  }
});

bot.login(BOT_TOKEN);