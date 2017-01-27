const BREAKPOINTS = `
!breakpoints <level>

where default level is 50

examples:

  !breakpoints
  !breakpoints 39
`

const RANK = `
!rank <rank name>

uses Levenshtein algorithm for comparison

examples:

  !rank Fru
  !rank Aleroin Knihgt (spelled incorrectly)
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
  '!rank': RANK,
  '!stat': STAT,
  '!stats': STATS,
  '!title': TITLE,
}
