import { HELP } from '../constants'

const SEPARATOR = '\n----------------------------------------------\n'

const createReply = message => `
\`\`\`
${message}
\`\`\`
`

export default message => {
  const [command = '', target = ''] = message.split(' ')

  return new Promise((resolve, reject) => {
    const reply = target
      ? createReply(HELP[target])
      : createReply(
          Object.keys(HELP)
            .map(key => HELP[key])
            .join(SEPARATOR)
        )

    resolve({ reply })
  })
}
