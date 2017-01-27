import Discord from 'discord.js'
import dotenv from 'dotenv'

import { help, rank, spellcraft, stats, title } from './commands'

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
  const commandStr = msgArr[0].toLowerCase()

  const command = {
    '!help': help,
    '!rank': rank,
    '!stat': stats,
    '!stats': stats,
    '!title': title,
  }[commandStr]

  if (command) {
    command(msg.content)
      .then((reply) => {
        if (commandStr === '!help') {
          msg.author.send(reply)
        } else {
          msg.channel.send(reply)
        }
      })
      .catch((err) => {
        msg.channel.send(err)
      })
  }
})

bot.login(BOT_TOKEN)
