import { BREAKPOINTS } from '../constants'

const createReply = message => `
\`\`\`
${message}
\`\`\`
`

export default level => {
  return new Promise((resolve, reject) => {
    const value = BREAKPOINTS[level] || BREAKPOINTS['50']
    const reply = createReply(value)

    if (value) {
      resolve({ reply })
    } else {
      reject(`Breakpoints for level '${level}' do not exist`)
    }
  })
}
