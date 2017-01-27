import Promise from 'bluebird'
import request from 'request-promise'

import { displayRank, formatIRS, formatNumber, nextRank } from '../utils'

const HERALD_SEARCH_API_URL = 'http://api.camelotherald.com/character/search'
const HERALD_INFO_API_URL = 'http://api.camelotherald.com/character/info'
const EXCIDIO_API_URL = 'http://heraldapi.excidio.net/character/info'

const searchByNameAndCluster = (name, cluster) => {
  console.log(`Searching camelot herald for '${name}' on '${cluster}'`)

  return new Promise((resolve, reject) => {
    request({
      uri: `${HERALD_SEARCH_API_URL}`,
      json: true,
      qs: {
        name,
        cluster,
      }
    })
    .then(response => {
      if (response.results.length) {
        console.log(`Fetched ${response.results.length} results from herald successfully`)

        resolve(response.results)
      } else {
        reject(`Could not find any characters matching name '${name}'`)
      }
    })
    .catch(err => {
      console.log(err)
    })
  })
}

const getMatchingCharacterId = (name, results) => {
  console.log(`Search for matching character with name '${name}'`)

  return new Promise((resolve, reject) => {
    const character = results.find(char => char.name.split(' ')[0] === name)

    resolve((character || results[0]).character_web_id)
  })
}

const fetchCharacterFromHerald = (id) => {
  console.log(`Fetch character stats from herald for id '${id}'`)

  return new Promise((resolve, reject) => {
    request({
      uri: `${HERALD_INFO_API_URL}/${id}`,
      json: true,
    })
    .then(response => {
      console.log('Fetched character from camelot herald successfully')

      resolve({
        ...response.realm_war_stats.current.player_kills.total,
        realm_points: response.realm_war_stats.current.realm_points,
      })
    })
    .catch(err => {
      console.log(err)
    })
  })
}

const fetchCharacterFromExcidio = (id, heraldStats) => {
  console.log(`Fetch character stats from excidio for id '${id}'`)

  return new Promise((resolve, reject) => {
    request({
      uri: `${EXCIDIO_API_URL}/${id}`,
      json: true,
    })
    .then(response => {
      console.log('Fetched character from excidio successfully')

      resolve(response)
    })
    .catch(err => {
      console.log(err)
    })
  })
}

const reply = (heraldStats, excidioStats) => {
  const { realm_points } = heraldStats
  const { live, week } = excidioStats

  return `
\`\`\`
-------------------------
CHARACTER
-------------------------
Name         ${live.name || ''}
Class        ${live.level || ''} ${live.race_name || ''} ${live.class_name || ''}
Rank         ${displayRank(realm_points)}
Next Rank    ${formatNumber(nextRank(realm_points))}

-------------------------
ALL TIME
-------------------------
${printAll(heraldStats)}

-------------------------
LAST WEEK
-------------------------
${printLastWeek(week)}

-------------------------
THIS WEEK
-------------------------
${printThisWeek(heraldStats, live)}
\`\`\`
`
}

const hasStats = (stats) => {
  return stats.kills
    || stats.death_blows
    || stats.solo_kills
    || stats.deaths
}

const printStats = (stats) => {
  return(
`RP           ${formatNumber(stats.realm_points)}
Kills        ${formatNumber(stats.kills)}
Deathblows   ${formatNumber(stats.death_blows)}
Solo Kills   ${formatNumber(stats.solo_kills)}
Deaths       ${formatNumber(stats.deaths)}
IRS          ${formatIRS(stats.realm_points / (stats.deaths || 1))}`)
}

const printAll = (herald) => {
  return printStats(herald)
}

const printLastWeek = (excidio) => {
  const stats = {
    realm_points: excidio.realm_points,
    kills: excidio.player_kills_total_kills,
    death_blows: excidio.player_kills_total_deaths,
    solo_kills: excidio.player_kills_total_solo_kills,
    deaths: excidio.player_kills_total_deaths,
  }

  if(hasStats(stats)) {
    return printStats(stats)
  } else {
    return 'No recent stats'
  }
}

const printThisWeek = (herald, excidio) => {
  const stats = {
    realm_points: herald.realm_points - excidio.realm_points,
    kills: herald.kills - excidio.player_kills_total_kills,
    death_blows: herald.death_blows - excidio.player_kills_total_death_blows,
    solo_kills: herald.solo_kills - excidio.player_kills_total_solo_kills,
    deaths: herald.deaths - excidio.player_kills_total_deaths,
  }

  if(hasStats(stats)) {
    return printStats(stats)
  } else {
    return 'No recent stats'
  }
}

export default (message) => {
  const [command = '', name = '', cluster = 'Ywain'] = message.split(' ')

  return new Promise((resolve, reject) => {
    searchByNameAndCluster(name, cluster)
      .then((results) => {
        return getMatchingCharacterId(name, results)
      })
      .then((id) => {
        return Promise.all([
          fetchCharacterFromHerald(id),
          fetchCharacterFromExcidio(id),
        ])
      })
      .spread((herald, excidio) => {
        try {
          resolve(reply(herald, excidio))
        } catch(e) {
          console.error(e)
        }
      })
      .catch((err) => {
        try {
          reject(err)
        } catch(e) {
          console.error(e)
        }
      })
  })
}
