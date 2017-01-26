import request from 'request-promise-native'
import Discord from 'discord.js'
import R from 'ramda'
import dotenv from 'dotenv'
import numeral from 'numeral'

dotenv.config()

const { BOT_TOKEN } = process.env
const HERALD_API_URL = 'http://api.camelotherald.com/character/search'
const EXCIDIO_API_URL = 'http://heraldapi.excidio.net/character/info'
const RANKS = [
  1, 1, 25, 125, 350, 750, 1375, 2275, 3500, 5100,
  7125, 9625, 12650, 16250, 20475, 25375, 31000, 37400, 44625, 52725,
  61750, 71750, 82775, 94875, 108100, 122500, 138125, 155025, 173250, 192850,
  213875, 236375, 260400, 286000, 313225, 342125, 372750, 405150, 439375, 475475,
  513500, 553500, 595525, 639625, 685850, 734250, 784875, 837775, 893000, 950600,
  1010625, 1073125, 1138150, 1205750, 1275975, 1348875, 1424500, 1502900, 1584125, 1668225,
  1755250, 1845250, 1938275, 2034375, 2133600, 2236000, 2341625, 2450525, 2562750, 2678350,
  2797375, 2919875, 3045900, 3175500, 3308725, 3445625, 3586250, 3730650, 3878875, 4030975,
  4187000, 4347000, 4511025, 4679125, 4851350, 5027750, 5208375, 5393275, 5582500, 5776100,
  5974125, 6176625, 6383650, 6595250, 6811475, 7032375, 7258000, 7488400, 7723625, 7963725,
  8208750, 9111713, 10114001, 11226541, 12461460, 13832221, 15353765, 17042680, 18917374, 20998286,
  23308097, 25871988, 28717906, 31876876, 35383333, 39275499, 43595804, 48391343, 53714390, 59622973,
  66181501, 73461466, 81542227, 90511872, 100468178, 111519678, 123786843, 137403395, 152517769, 169294723,
  187917143
]

const searchByNameAndCluster = R.curry((name, cluster) => {
  console.log(`Searching camelot herald for '${name}' on '${cluster}'`)

  return new Promise((resolve, reject) => {
    request({
      uri: `${HERALD_API_URL}`,
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
})

const getMatchingCharacterId = (name, results) => {
  console.log(`Search for matching character with name '${name}'`)

  return new Promise((resolve, reject) => {
    const character = results.find(char => char.name.split(' ')[0] === name)

    resolve((character || results[0]).character_web_id)
  })
}

const fetchCharacterFromExcidio = (id) => {
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

const displayRank = (rps) => {
	const baseRank = RANKS.findIndex((value) => {
		return rps <= value
  })
  const primaryRank = Math.max(1, Math.floor(((baseRank + 10) / 10)))
  const secondaryRank = Math.max(0, baseRank % 10 - 1)

  return `${primaryRank}L${secondaryRank}`
}

const nextRank = (rps) => {
	const nextIndex = RANKS.findIndex((value) => {
		return value > rps
  })

  return RANKS[nextIndex] - rps;
}

const formatNumber = (value) => numeral(value).format('0,0')

const formatIRS = (value) => numeral(value).format('0,0.00')

const reply = ({ live, week }) => `
\`
---------
CHARACTER
---------
Name         ${week.name || live.name}
Class        ${week.class_name || live.class_name}
Race         ${week.race_name || live.race_name}
Rank         ${displayRank(live.realm_points)} - ${formatNumber(live.realm_points)}
---------
ALL TIME
---------
Kills        ${formatNumber(live.player_kills_total_kills)}
Deathblows   ${formatNumber(live.player_kills_total_death_blows)}
Solo Kills   ${formatNumber(live.player_kills_total_solo_kills)}
Deaths       ${formatNumber(live.player_kills_total_deaths)}
IRS          ${formatIRS(live.realm_points / live.player_kills_total_deaths)}
---------
LAST WEEK
---------
Kills        ${formatNumber(week.player_kills_total_kills || 0)}
Deathblows   ${formatNumber(week.player_kills_total_death_blows || 0)}
Solo Kills   ${formatNumber(week.player_kills_total_solo_kills || 0)}
Deaths       ${formatNumber(week.player_kills_total_deaths || 0)}
IRS          ${formatIRS(week.realm_points / week.player_kills_total_deaths)}
\`
`

const bot = new Discord.Client()

bot.on('ready', () => {
  console.log('I am ready!')
})

bot.on('message', message => {
  const [command, name, cluster = 'Ywain'] = message.content.split(' ')

  if (command === '!stats') {
    searchByNameAndCluster(name, cluster)
      .then(results => {
        return getMatchingCharacterId(name, results)
      })
      .then(id => {
        return fetchCharacterFromExcidio(id)
      })
      .then(character => {
        try {
          message.channel.sendMessage(reply(character))
        } catch (e) {
          console.log(e)
        }
      })
      .catch(err => {
        message.channel.sendMessage(err)
      })

  }
})

bot.login(BOT_TOKEN)
