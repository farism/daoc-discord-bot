import { describe, it } from 'mocha';
import { expect } from 'chai';

import { nextRank } from '../src/utils'

describe('nextRank', () => {

  it('returns the number of RPs required to reach the next rank', () => {
    expect(nextRank(1079134)).to.equal(59016)
  });

});
