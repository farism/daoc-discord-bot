import { BREAKPOINTS } from '../constants'

export default (message) => {
  const [command = '', level = '50'] = message.split(' ')

  return new Promise((resolve, reject) => {
    // const value = BREAKPOINTS[level]
    console.log(value)
    // if (value) {
    //   resolve(`${value}`)
    // } else {
    //   reject(`Breakpoints for level '${level}' do not exist`)
    // }
  })
}
