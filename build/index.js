'use strict';

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _commands = require('./commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var BOT_TOKEN = process.env.BOT_TOKEN;

var BOT_PREFIX = '!';

var bot = new _discord2.default.Client();

bot.on('ready', function () {
  console.log('I am ready!');
});

bot.on('message', function (msg) {
  if (msg.author.bot || !msg.content.startsWith(BOT_PREFIX)) {
    return;
  }

  var msgArr = msg.content.split(' ');
  var commandStr = msgArr[0].toLowerCase();

  var command = {
    '!help': _commands.help,
    '!rank': _commands.rank,
    '!stat': _commands.stats,
    '!stats': _commands.stats,
    '!title': _commands.title
  }[commandStr];

  if (command) {
    command(msg.content).then(function (reply) {
      if (commandStr === '!help') {
        msg.author.send(reply);
      } else {
        msg.channel.send(reply);
      }
    }).catch(function (err) {
      msg.channel.send(err);
    });
  }
});

bot.login(BOT_TOKEN);