import {describe, it} from 'mocha'
import {expect} from 'chai'

import {isRank} from '../../src/utils'

describe('isRank', () => {
  it('works with single digit ranks', () => {
    expect(isRank('1')).to.equal(true)
    expect(isRank('1L')).to.equal(true)
    expect(isRank('1L9')).to.equal(true)
  })

  it('works with double digit ranks', () => {
    expect(isRank('10')).to.equal(true)
    expect(isRank('10L')).to.equal(true)
    expect(isRank('10L9')).to.equal(true)
  })

  it('ignores case sensitivity', () => {
    expect(isRank('1')).to.equal(true)
    expect(isRank('1l')).to.equal(true)
    expect(isRank('1l9')).to.equal(true)
    expect(isRank('10')).to.equal(true)
    expect(isRank('10l')).to.equal(true)
    expect(isRank('10l9')).to.equal(true)
  })

  it('returns false when value is not rank format', () => {
    expect(isRank('foo')).to.equal(false)
    expect(isRank('fooLbar')).to.equal(false)
  })
})
