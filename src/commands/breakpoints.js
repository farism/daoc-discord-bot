import {BREAKPOINTS} from '../constants'

const createReply = message => `
\`\`\`
${message}
\`\`\`
`

export default message => {
  const [command = '', level = '50'] = message.split(' ')

  return new Promise((resolve, reject) => {
    const value = BREAKPOINTS[level]
    const reply = createReply(value)

    if (value) {
      resolve({reply})
    } else {
      reject(`Breakpoints for level '${level}' do not exist`)
    }
  })
}
