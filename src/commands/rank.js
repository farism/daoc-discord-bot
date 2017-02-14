import numeral from 'numeral'
import Levenshtein from 'levenshtein'

import { RANK_TITLES, RANK_VALUES } from '../constants'
import { formatNumber, isRank } from '../utils'

const rankToTitle = (value) => {
  return new Promise((resolve, reject) => {
    const rankArr = value.toLowerCase().split('l')
    const primary = parseInt(rankArr[0] || 1, 10)
    const secondary = parseInt(rankArr[1] || 0, 10)
    const rankValueIndex = ((primary - 1) * 10) + secondary
    const titles = RANK_TITLES[primary - 1].join(', ')
    const requiredRPs = RANK_VALUES[rankValueIndex]

    if (requiredRPs) {
      resolve(`\`RR ${value}\` titles are \`${titles}\`, achievable at \`${formatNumber(requiredRPs)}\` rps`)
    } else {
      reject('Could not find rank, please check spelling')
    }
  })
}

const titleToRank = (value) => {
  return new Promise((resolve, reject) => {
    var closest = null
    var level = null
    var rank = ''

    RANK_TITLES.forEach((tier, i) => {
      tier.forEach((title) => {
        const lev = new Levenshtein(title.toLowerCase(), value.toLowerCase())

        if (closest === null || lev.distance < closest) {
          closest = lev.distance
          level = i
          rank = title
        }
      })
    })

    if (rank && level && closest <= 3) {
      const primary = level + 1
      const rankValueIndex = (level * 10) || 1
      const requiredRPs = formatNumber(RANK_VALUES[rankValueIndex])

      resolve(`\`${rank}\` is \`RR ${primary}L0\`, achievable at \`${requiredRPs}\` rps`)
    } else {
      reject('Could not find rank, please check spelling')
    }
  })
}

export default (message) => {
  const input = message.replace('!rank ', '')

  return isRank(input)
    ? rankToTitle(input)
    : titleToRank(input)
}
