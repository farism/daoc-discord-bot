import { RANK_VALUES } from '../constants'

export default (rps) => {
	const baseRank = RANK_VALUES.findIndex((value) => {
		return rps <= value
  })
  const primaryRank = Math.max(1, Math.floor(((baseRank + 10) / 10)))
  const secondaryRank = Math.max(0, baseRank % 10 - 1)

  return `${primaryRank}L${secondaryRank}`
}
