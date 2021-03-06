const BREAKPOINTS = `
!breakpoints <level>

where default level is 50

examples:

  !breakpoints
  !breakpoints 39
`

const GUILD = `
!guild <guild name>

examples:

  !guild Dark Knights of Camelot
`

const RANK = `
!rank <rank level> | <rank name>

uses Levenshtein algorithm for comparison

examples:

  !rank 5
  !rank 10L5
  !rank Fru
  !rank Aleroin Knihgt (spelled incorrectly)
`

const RESISTS = `
!resists <alb|hib|mid>

examples:

  !resists alb
  !resists albion
`

const STAT = `
!stat <player name> [<server name>]

where default server name is Ywain

examples:

  !stat Herorius
  !stat Electronika Gaheris
`

const STATS = `
!stats <player name> [<server name>]

alias for !stat
`

const TITLE = `
!title <title name>

examples:

  !title Lone Enforcer
`

export default {
  '!breakpoints': BREAKPOINTS,
  '!guild': GUILD,
  '!rank': RANK,
  '!resists': RESISTS,
  '!stat': STAT,
  '!stats': STATS,
  '!title': TITLE,
}
