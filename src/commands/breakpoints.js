import { BREAKPOINTS } from '../constants'

const reply = (message) => `
\`\`\`
${message}
\`\`\`
`

export default (message) => {
  const [command = '', level = '50'] = message.split(' ')

  return new Promise((resolve, reject) => {
    const value = BREAKPOINTS[level]

    if (value) {
      resolve(reply(value))
    } else {
      reject(`Breakpoints for level '${level}' do not exist`)
    }
  })
}
