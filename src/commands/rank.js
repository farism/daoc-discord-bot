import numeral from 'numeral'
import Levenshtein from 'levenshtein'

import { RANK_TITLES, RANK_VALUES } from '../constants'

export default (message) => {
  const input = message.replace('!rank ', '').toLowerCase()

  var closest = null
  var level = null
  var rank = ''

  RANK_TITLES.forEach((tier, i) => {
    tier.forEach((title) => {
      const distance = new Levenshtein(title.toLowerCase(), input).distance

      if (closest === null || distance < closest) {
        closest = distance
        level = i
        rank = title
      }
    })
  })

  return new Promise((resolve, reject) => {
    if (rank && level && closest <= 5) {
      const rankValueIndex = (level * 10) || 1
      const requiredRPs = numeral(RANK_VALUES[rankValueIndex]).format('0,0')

      resolve(`'${rank}' is RR ${level + 1}L0, achievable at ${requiredRPs} rps`)
    } else {
      reject('Could not find rank, please check spelling')
    }
  })
}
