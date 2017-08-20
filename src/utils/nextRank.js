import {RANK_VALUES} from '../constants'

export default rps => {
  const nextIndex = RANK_VALUES.findIndex(value => {
    return value > rps
  })

  return RANK_VALUES[nextIndex] - rps
}
