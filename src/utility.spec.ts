import { getSuitDictionary } from "./shared";
import { getBidCount, getBidStack, getCombinedPoints, getHighCardPoints, isBalanced, isOpeningBid } from "./utility";

describe('utility', () => {

  it('isOpeningBid', () => {
    expect(isOpeningBid({
      north: [ ' ' ],
      east: [ '-' ],
      south: [ '-' ],
      west: []
    } as any)).toBe(true);

    expect(isOpeningBid({
      north: [ ' ' ],
      east: [ '-' ],
      south: [ '-' ],
      west: [ '1NT' ]
    } as any)).toBe(false);
  });

  it('getBidCount', () => {
    expect(getBidCount({
      north: [ ' ' ],
      east: [ '-' ],
      south: [ '-' ],
      west: []
    } as any)).toBe(2);

    expect(getBidCount({
      north: [ ' ' ],
      east: [ '-' ],
      south: [ '-' ],
      west: [ '1NT' ]
    } as any)).toBe(3);
  });

  it('getBidStack', () => {
    expect(getBidStack({
      north: [ ' ' ],
      east: [ '-' ],
      south: [ '-' ],
      west: []
    } as any)).toEqual({
      bids: [ '-', '-' ],
      directions: [ 'E', 'S' ],
      count: 2
    });

    expect(getBidStack({
      north: [ ' ', '-' ],
      east: [ '-', '2NT' ],
      south: [ '-' ],
      west: [ '1NT' ]
    } as any)).toEqual({
      bids: [ '-', '-', '1NT', '-', '2NT' ],
      directions: [ 'E', 'S', 'W', 'N', 'E' ],
      count: 5
    });
  });

  it('getHighCardPoints', () => {
    expect(getHighCardPoints(['AS', 'QS', '5S', 'JH', '4C'])).toBe(4 + 2 + 1);
    expect(getHighCardPoints(['10S', '9S', '5H'])).toBe(0);
  });

  
  it('isBalanced', () => {
    expect(isBalanced(getSuitDictionary(['AS', 'QS', '5S', 'JH', '4H', '3H', 'AC', 'QC', '10C']))).toBe(false);
    expect(isBalanced(getSuitDictionary(['AS', 'QS', '5S', 'JH', '4H', '3H', 'JD', '5D', 'AC', 'QC', '10C']))).toBe(true);
    expect(isBalanced(getSuitDictionary(['AS', 'QS', '5S', 'JH', '4H', '3H', 'JD', '5D', 'AC', 'QC']))).toBe(false);
    expect(isBalanced(getSuitDictionary(['AS', 'JH', '4H', '3H', 'QD', 'JD', '5D', 'AC', 'QC', '5C']))).toBe(false);
    expect(isBalanced(getSuitDictionary(['AS', 'JS', 'JH', '4H', '3H', 'QD', 'JD', '5D', 'AC', 'QC', '5C']))).toBe(true);
  });

  it('getComibinedPoints', () => {
    expect(getCombinedPoints(getSuitDictionary(['AS', 'QS', '5S', '2S', 'JH', '4H', '3H', 'AC', 'QC', '10C', '9C', '3C', '2C']))).toBe(4 + 2 + 1 + 4 + 2 + 3);
  })

});