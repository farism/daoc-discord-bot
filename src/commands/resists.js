import { RESISTS } from '../constants'

const createReply = message => `
\`\`\`
${message}
\`\`\`
`

export default realm => {
  return new Promise((resolve, reject) => {
    if (!realm) {
      reject(`Please enter a realm e.g. !resists alb`)
    } else {
      const value = RESISTS[(realm || '').toLowerCase()]

      if (value) {
        const reply = createReply(value)
        resolve({ reply })
      } else {
        reject(`Resists for realm '${realm}' do not exist`)
      }
    }
  })
}
