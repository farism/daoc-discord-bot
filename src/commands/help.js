import { HELP } from '../constants'

const SEPARATOR = '\n----------------------------------------------\n'

const reply = (message) => `
\`\`\`
${message}
\`\`\`
`

export default (message) => {
  const [command = '', target = ''] = message.split(' ')

  return new Promise((resolve, reject) => {
    if (target) {
      resolve(reply(HELP[target]))
    } else {
      resolve(reply(Object.keys(HELP).map((key) => HELP[key]).join(SEPARATOR)))
    }
  })
}
