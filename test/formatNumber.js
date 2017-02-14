import { describe, it } from 'mocha';
import { expect } from 'chai';

import { formatNumber } from '../src/utils'

describe('formatNumber', () => {

  it('properly formats number as comma separated with 0 (zero) decimal places', () => {
    expect(formatNumber('543216789')).to.equal('543,216,789')
  });

});
