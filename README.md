# daoc-discord-bot [![Circle CI](https://circleci.com/gh/farism/daoc-discord-bot/tree/master.svg?style=svg)](https://circleci.com/gh/farism/daoc-discord-bot/tree/master)

A DAoC bot for discord

## Commands
`!rank <rank name>`
- uses Levenshtein algorithm for comparison

_examples:_
```
!rank Fru
!rank Aleroin Knihgt (spelled incorrectly)
```

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

#  

`!breakpoints <level>`
- where default level is 50

_examples:_
```
!breakpoints
!breakpoints 39
```
