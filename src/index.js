import Discord from 'discord.js'
import dotenv from 'dotenv'

import { breakpoints, guild, help, rank, spellcraft, stats, title } from './commands'

dotenv.config()

const { BOT_TOKEN } = process.env
const BOT_PREFIX = '!';

const bot = new Discord.Client()

bot.on('ready', () => {
  console.log('I am ready!')
})

bot.on('message', (msg) => {
  if(msg.author.bot || !msg.content.startsWith(BOT_PREFIX)) {
    return
  }

  const msgArr = msg.content.split(' ')
  const commandStr = msgArr.shift().toLowerCase()
  const paramStr = msgArr.join(' ')

  const command = {
    '!breakpoints': breakpoints,
    '!guild': guild,
    '!help': help,
    '!rank': rank,
    '!stat': stats,
    '!stats': stats,
    '!title': title,
  }[commandStr]

  if (command) {
    command(paramStr)
      .then((reply) => {
        msg[commandStr === '!help' ? 'author' : 'channel']
          .send(reply)
          .catch((err) => {
            console.log('Error sending message to Discord', err.response.body)
          })
      })
      .catch((err) => {
        msg.channel.send(err)
      })
  }
})

bot.login(BOT_TOKEN)
