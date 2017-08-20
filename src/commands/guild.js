import Promise from 'bluebird'
import request from 'request-promise'

import {displayRank, formatIRS, formatNumber, nextRank} from '../utils'

const HERALD_SEARCH_API_URL = 'http://api.camelotherald.com/guild/search'
const HERALD_INFO_API_URL = 'http://api.camelotherald.com/guild/info'
const EXCIDIO_API_URL = 'http://heraldapi.excidio.net/guild/info'
const EXCIDIO_GUILD_URL = 'http://excidio.net/herald/guild'

const searchByName = (name, cluster) => {
  console.log(`Searching camelot herald for guild '${name}'`)

  return new Promise((resolve, reject) => {
    request({
      uri: `${HERALD_SEARCH_API_URL}`,
      json: true,
      qs: {
        name,
      },
    })
      .then(response => {
        if (response.results.length) {
          console.log(
            `Fetched ${response.results
              .length} results from herald successfully`
          )

          resolve(response.results)
        } else {
          reject(`Could not find any guilds matching name '${name}'`)
        }
      })
      .catch(err => {
        console.log(err)
        reject('Could not fetch guild list from herald')
      })
  })
}

const getMatchingGuildId = (name, results) => {
  console.log(`Search for matching guild with name '${name}'`)

  return new Promise((resolve, reject) => {
    const guild = results.find(guild => {
      // TODO figure out how to deal with cluster here
      return (
        guild.server_name.match(/Ywain\d/) &&
        guild.name.toLowerCase() === name.toLowerCase()
      )
    })

    resolve((guild || results[0]).guild_web_id)
  })
}

const fetchGuildFromHerald = id => {
  console.log(`Fetch guild stats from herald for id '${id}'`)

  return new Promise((resolve, reject) => {
    request({
      uri: `${HERALD_INFO_API_URL}/${id}`,
      json: true,
    })
      .then(response => {
        console.log('Fetched guild from camelot herald successfully')

        const alliance = response.alliance || {}
        const leader = alliance.alliance_leader || {}

        resolve({
          ...response,
          ...response.realm_war_overall,
          alliance: leader.name || 'N/A',
        })
      })
      .catch(err => {
        console.log(err)
        reject('Could not fetch guild from herald')
      })
  })
}

const fetchGuildFromExcidio = (id, heraldStats) => {
  console.log(`Fetch guild stats from excidio for id '${id}'`)

  return new Promise((resolve, reject) => {
    request({
      uri: `${EXCIDIO_API_URL}/${id}`,
      json: true,
    })
      .then(response => {
        console.log('Fetched guild from excidio successfully')

        resolve(response)
      })
      .catch(err => {
        console.log(err)
        reject('Could not fetch guild from excidio')
      })
  })
}

const hasStats = stats => {
  return (
    stats.realm_points ||
    stats.player_kills_total_kills ||
    stats.player_kills_total_death_blows ||
    stats.player_kills_total_deaths
  )
}

const printStats = stats => {
  return `RP           ${formatNumber(stats.realm_points)}
Kills        ${formatNumber(stats.player_kills_total_kills)}
Deathblows   ${formatNumber(stats.player_kills_total_death_blows)}
Solo Kills   ${formatNumber(stats.player_kills_total_solo_kills)}
Deaths       ${formatNumber(stats.player_kills_total_deaths)}
IRS          ${formatIRS(
    stats.realm_points / (stats.player_kills_total_deaths || 1)
  )}`
}

const createReply = (heraldStats, excidioStats) => {
  const {live, week} = excidioStats

  return `
\`\`\`
-------------------------
GUILD
-------------------------
Name         ${heraldStats.name}
Alliance     ${heraldStats.alliance}
Accounts     ${formatNumber(heraldStats.member_accounts)}
Characters   ${formatNumber(heraldStats.member_characters)}

-------------------------
ALL TIME
-------------------------
${printStats(live)}

-------------------------
LAST WEEK
-------------------------
${hasStats(week) ? printStats(week) : 'No recent stats'}
\`\`\`
`
}

export default params => {
  // TODO figure out how to deal with cluster here
  const name = params

  return new Promise((resolve, reject) => {
    searchByName(name)
      .then(results => {
        return getMatchingGuildId(name, results)
      })
      .then(id => {
        return Promise.all([
          fetchGuildFromHerald(id),
          fetchGuildFromExcidio(id),
          Promise.resolve(`${EXCIDIO_GUILD_URL}/${id}`),
        ])
      })
      .spread((herald, excidio, update) => {
        resolve({
          reply: createReply(herald, excidio),
          meta: {update},
        })
      })
      .catch(err => {
        resolve(err)
      })
  })
}
