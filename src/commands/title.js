import { TITLES } from '../constants'

export default (message) => {
  const title = message.replace('!title ', '')

  return new Promise((resolve, reject) => {
    const value = TITLES[title.toLowerCase()]

    if (value) {
      resolve({ reply: `${value} to obtain title '${title}'` })
    } else {
      reject(`Title '${title}' does not exist`)
    }
  })
}
