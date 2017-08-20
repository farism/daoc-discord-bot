import tz from 'moment-timezone'

const timezone = value => {
  return ['1:00 am est']
}

export default message => {
  const input = message.replace('!tz ', '')

  return timezone(input)
}
