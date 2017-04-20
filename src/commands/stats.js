import Promise from 'bluebird'
import request from 'request-promise'

import { displayRank, formatIRS, formatNumber, nextRank } from '../utils'

const HERALD_SEARCH_API_URL = 'http://api.camelotherald.com/character/search'
const HERALD_INFO_API_URL = 'http://api.camelotherald.com/character/info'
const EXCIDIO_API_URL = 'http://heraldapi.excidio.net/character/info'
const EXCIDIO_CHARACTER_URL = 'http://sc.excidio.net/herald/character'

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
      reject('Could not fetch character list from herald')
    })
  })
}

const getMatchingCharacterId = (name, results) => {
  console.log(`Search for matching character with name '${name}'`)

  return new Promise((resolve, reject) => {
    const character = results.find(char => {
      return char.name.split(' ')[0].toLowerCase() === name.toLowerCase()
    })

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

      resolve(response)
    })
    .catch(err => {
      console.log(err)
      reject('Could not fetch guild from herald')
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
      reject('Could not fetch character from excidio')
    })
  })
}

const createReply = (heraldStats, excidioStats) => {
  const { class_name, level, name, race, realm_war_stats } = heraldStats
  const { current: { realm_points, player_kills: { total } } } = realm_war_stats
  const { live, week } = excidioStats

  return `
\`\`\`
-------------------------
CHARACTER
-------------------------
Name         ${name || ''}
Class        ${level || ''} ${race || ''} ${class_name || ''}
Rank         ${displayRank(realm_points)}
Next Rank    ${formatNumber(nextRank(realm_points))}

-------------------------
ALL TIME
-------------------------
${printAll({ ...total, realm_points })}

-------------------------
LAST WEEK
-------------------------
${printLastWeek(week)}

-------------------------
THIS WEEK
-------------------------
${printThisWeek(realm_war_stats.current, live)}
\`\`\`
`
}

const hasStats = (stats) => {
  return stats.realm_points
    || stats.kills
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
    death_blows: excidio.player_kills_total_death_blows,
    solo_kills: excidio.player_kills_total_solo_kills,
    deaths: excidio.player_kills_total_deaths,
  }

  if(hasStats(stats)) {
    return printStats(stats)
  } else {
    return 'No recent stats'
  }
}

const printThisWeek = (current, excidio) => {
  const { realm_points, player_kills: { total } } = current

  const stats = {
    realm_points: realm_points - excidio.realm_points,
    kills: total.kills - excidio.player_kills_total_kills,
    death_blows: total.death_blows - excidio.player_kills_total_death_blows,
    solo_kills: total.solo_kills - excidio.player_kills_total_solo_kills,
    deaths: total.deaths - excidio.player_kills_total_deaths,
  }

  if(hasStats(stats)) {
    return printStats(stats)
  } else {
    return 'No recent stats'
  }
}

export default (params) => {
  const [name = '', cluster = 'Ywain'] = params.split(' ')

  return new Promise((resolve, reject) => {
    searchByNameAndCluster(name, cluster)
      .then((results) => {
        return getMatchingCharacterId(name, results)
      })
      .then((id) => {
        return Promise.all([
          fetchCharacterFromHerald(id),
          fetchCharacterFromExcidio(id),
          Promise.resolve(`${EXCIDIO_CHARACTER_URL}/${id}`)
        ])
      })
      .spread((herald, excidio, update) => {
        resolve({
          reply: createReply(herald, excidio),
          meta: { update },
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
