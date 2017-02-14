import { describe, it } from 'mocha';
import { expect } from 'chai';

import { RANK_VALUES } from '../../src/constants'
import { displayRank } from '../../src/utils'

describe('displayRank', () => {

  it('properly displays all L0 ranks', () => {
    expect(displayRank(RANK_VALUES[0])).to.equal('1L1')
    expect(displayRank(RANK_VALUES[10])).to.equal('2L0')
    expect(displayRank(RANK_VALUES[20])).to.equal('3L0')
    expect(displayRank(RANK_VALUES[30])).to.equal('4L0')
    expect(displayRank(RANK_VALUES[40])).to.equal('5L0')
    expect(displayRank(RANK_VALUES[50])).to.equal('6L0')
    expect(displayRank(RANK_VALUES[60])).to.equal('7L0')
    expect(displayRank(RANK_VALUES[70])).to.equal('8L0')
    expect(displayRank(RANK_VALUES[80])).to.equal('9L0')
    expect(displayRank(RANK_VALUES[90])).to.equal('10L0')
    expect(displayRank(RANK_VALUES[100])).to.equal('11L0')
    expect(displayRank(RANK_VALUES[110])).to.equal('12L0')
    expect(displayRank(RANK_VALUES[120])).to.equal('13L0')
    expect(displayRank(RANK_VALUES[130])).to.equal('14L0')
  });

  it('properly displays all lower boundary ranks', () => {
    expect(displayRank(RANK_VALUES[0]+1)).to.equal('1L1')
    expect(displayRank(RANK_VALUES[10]-1)).to.equal('1L9')
    expect(displayRank(RANK_VALUES[20]-1)).to.equal('2L9')
    expect(displayRank(RANK_VALUES[30]-1)).to.equal('3L9')
    expect(displayRank(RANK_VALUES[40]-1)).to.equal('4L9')
    expect(displayRank(RANK_VALUES[50]-1)).to.equal('5L9')
    expect(displayRank(RANK_VALUES[60]-1)).to.equal('6L9')
    expect(displayRank(RANK_VALUES[70]-1)).to.equal('7L9')
    expect(displayRank(RANK_VALUES[80]-1)).to.equal('8L9')
    expect(displayRank(RANK_VALUES[90]-1)).to.equal('9L9')
    expect(displayRank(RANK_VALUES[100]-1)).to.equal('10L9')
    expect(displayRank(RANK_VALUES[110]-1)).to.equal('11L9')
    expect(displayRank(RANK_VALUES[120]-1)).to.equal('12L9')
    expect(displayRank(RANK_VALUES[130]-1)).to.equal('13L9')
  });

  it('properly displays random rank values', () => {
    expect(displayRank(11471)).to.equal('2L1')
    expect(displayRank(87321)).to.equal('3L2')
    expect(displayRank(305876)).to.equal('4L3')
    expect(displayRank(724123)).to.equal('5L4')
    expect(displayRank(1384012)).to.equal('6L5')
    expect(displayRank(2371230)).to.equal('7L6')
    expect(displayRank(3749871)).to.equal('8L7')
    expect(displayRank(5701234)).to.equal('9L8')
    expect(displayRank(8012302)).to.equal('10L9')
    expect(displayRank(9140013)).to.equal('11L1')
    expect(displayRank(30123125)).to.equal('12L2')
    expect(displayRank(93412321)).to.equal('13L3')
  });

});
