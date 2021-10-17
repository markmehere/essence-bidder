import { ApiContract } from "../api/interfaces";
import { isOpeningBid, getCombinedPoints, getHighCardPoints, isBalanced, getLongestSuit } from "../utility";
import { StandardSuitDictionary, allSuits } from "../shared";

export function Opener(cards: string[], contract: ApiContract, sd: StandardSuitDictionary) {
  const hcp = getHighCardPoints(cards);

  // Open 1NT
  if (isOpeningBid(contract) && hcp >= 14 && hcp < 20 && isBalanced(sd)) {
    return '1NT';
  }

  // Open 2NT
  if (isOpeningBid(contract) && hcp >= 20 && hcp <= 26 && isBalanced(sd)) {
    return '2NT';
  }

  // Open 3X
  const longestSuit = getLongestSuit(sd);
  if (sd[longestSuit].count >= 6 &&
    (sd[longestSuit].count > 6 || hcp >= 18) && sd[longestSuit].high[0] === 'A' && (sd[longestSuit].all[1][0] === 'K' || sd[longestSuit].all[1][0] === 'Q')) {
    return `3${longestSuit}`;
  }
  if (hcp > 23 && sd[longestSuit].count >= 6 && sd[longestSuit].high[0] === 'A') {
    return '3NT';
  }

  // Open 2C
  if (getCombinedPoints(sd) >= 20) {
    return '2C';
  }

  // Open 1 color
  if (getCombinedPoints(sd) >= 12) {
    const highest = allSuits.reduce((acc, suit) => {
      if (sd[suit] && sd[suit].count >= 5) {
        if (!acc || (sd[suit].count > sd[acc].count)) {
          return suit;
        }
      }
      return acc;
    }, '');
    if (highest) return `1${highest}`;
    else { 
      const clubPts = sd.C && sd.C.count > 2 ? (getHighCardPoints(sd.C.all) * sd.C.count) : 0;
      const diamondPts = sd.D && sd.D.count > 2 ? (getHighCardPoints(sd.D.all) * sd.D.count) : 0;
      if (clubPts && clubPts > diamondPts) return '1C';
      else if (diamondPts) return '1D';
    }
  }

  // Open 2X
  if (hcp >= 10) {
    const doNotBid = (longestSuit === 'C' || sd[longestSuit].count < 6 ||
      (sd[longestSuit].high[0] !== 'K' && sd[longestSuit].high[0] !== 'A'));
    if (!doNotBid) return `2${longestSuit}`;
  }

}