'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RANK = '\n!rank <rank name>\n\nuses Levenshtein algorithm for comparison\n\nexamples:\n\n  !rank Fru\n  !rank Aleroin Knihgt (spelled incorrectly)\n';

var STAT = '\n!stat <player name> [<server name>]\n\nwhere default servername is Ywain\n\nexamples:\n\n  !stat Herorius\n  !stat Electronika Gaheris\n';

var STATS = '\n!stats <player name> [<server name>]\n\nalias for !stat\n';

var TITLE = '\n!title <title name>\n\nexamples:\n\n  !title Lone Enforcer\n';

exports.default = {
  '!rank': RANK,
  '!stat': STAT,
  '!stats': STATS,
  '!title': TITLE
};