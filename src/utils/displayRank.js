import { getRank } from './'

export default (rps) => {
	const { primary, secondary } = getRank(rps)

  return `${primary}L${secondary}`
}
