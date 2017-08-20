import {describe, it} from 'mocha'
import {expect} from 'chai'

import {formatIRS} from '../../src/utils'

describe('formatIRS', () => {
  it('properly formats IRS as comma separated and 2 (two) decimal places', () => {
    expect(formatIRS('543216789.321')).to.equal('543,216,789.32')
  })
})
