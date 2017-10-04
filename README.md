# daoc-discord-bot [![Circle CI](https://circleci.com/gh/farism/daoc-discord-bot/tree/master.svg?style=svg)](https://circleci.com/gh/farism/daoc-discord-bot/tree/master)

A DAoC bot for discord

## Commands
`!breakpoints <level>`
- where default level is 50

_examples:_
```
!breakpoints
!breakpoints 39
```

#

`!guild <guild name>`

_examples:_
```
!guild Dark Knights of Camelot
```

#

`!rank <rank level> | <rank name>`
- uses Levenshtein algorithm for comparison

_examples:_
```
!rank 5
!rank 10L5
!rank Fru
!rank Aleroin Knihgt (spelled incorrectly)
```

#

`!resist <realm>`
- where realm is one of "Alb", "Albion", "Hib", "Hibernia", "Mid", "Midgard". Case insensitive

_examples:_
```

!resist alb
!resist Hibernia
```

#

`!resists <realm>`
- alias for `!resist`

#

`!stat <player name> [<server name>]`
- where default server name is Ywain

_examples:_
```

!stat Herorius
!stat Electronika Gaheris
```

#

`!stats <player name> [<server name>]`
- alias for `!stat`

#

`!title <title name>`

_examples:_

```
!title Lone Enforcer
```
