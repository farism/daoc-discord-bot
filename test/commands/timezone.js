import {describe, it} from 'mocha'
import {expect} from 'chai'

import {timezone} from '../../src/commands'

describe('!tz', () => {
  it('converts player timezone to global timezones', () => {
    const timezones = timezone('10 pm')
    expect(timezones).to.eql(['1:00 am est'])
  })
})
