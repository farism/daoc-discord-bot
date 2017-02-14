import { RANK_VALUES } from '../constants'

export default (rps) => {
	const baseRank = Math.max(1, RANK_VALUES.findIndex((value) => value > rps) - 1)
	const rankStr = (baseRank + 10).toString()
	const primary = rankStr.substr(0, rankStr.length - 1)
	const secondary = rankStr.substr(primary.length, 1)

  return { primary, secondary }
}
