import { describe, it } from 'mocha';
import { expect } from 'chai';

import { rank } from '../../src/commands'

describe('!rank', () => {

  it('converts rank format (10L0) to required rps', () => {
    return rank('11L0')
      .then(({ reply }) => {
        expect(reply).to.equal('`RR 11L0` titles are `Lord, Lady, Barun, Banbharun, Herra, Fru`, achievable at `8,208,750` rps')
      })
  });

  it('converts rank title to rank display and required rps', () => {
    return rank('Fru')
      .then(({ reply }) => {
        expect(reply).to.equal("`Fru` is `RR 11L0`, achievable at `8,208,750` rps")
      })
  });

  it('fails when rank title cannot be found', () => {
    return rank('SomeRandomRank')
      .catch((reject) => {
        expect(reject).to.equal('Could not find rank, please check spelling')
      })
  });

});
