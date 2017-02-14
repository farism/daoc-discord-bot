import { describe, it } from 'mocha';
import { expect } from 'chai';

import { getRank } from '../../src/utils'

describe('getRank', () => {

  it('returns primary and secondary rank', () => {
    expect(getRank(3212314)).to.deep.equal({ primary: '8', secondary: '3' })
    expect(getRank(5216789)).to.deep.equal({ primary: '9', secondary: '6' })
  });

});
