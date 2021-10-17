import { ApiContract } from "../api/interfaces";
import { getBidStack, getHighCardPoints, isGoodFive, isOpeningBid } from "../utility";
import { allSuits, StandardSuitDictionary } from "../shared";

export function DefensiveDoubler(cards: string[], contract: ApiContract, sd: StandardSuitDictionary) {
  const hcp = getHighCardPoints(cards);
  const goodSuit = allSuits.filter(s => isGoodFive(s, sd));
  const aceSuit = allSuits.filter(s => sd[s] && sd[s].high[0] === 'A');
  const kingSuit = allSuits.filter(s => sd[s] && sd[s].high[0] === 'K');
  const kingsPresent = allSuits.filter(s => sd[s] && (sd[s].high[0] === 'K' || (sd[s].all[1] && sd[s].all[1][0] === 'K')));
  const bidStack = getBidStack(contract);
  const callBeingDoubled = bidStack.bids[bidStack.count - 1] && (bidStack.bids[bidStack.count - 1].length >= 2 || bidStack.bids[bidStack.count - 1] === 'D') ? bidStack.bids[bidStack.count - 1] : bidStack.bids[bidStack.count - 3];
  const suitBeingDoubled = callBeingDoubled ? callBeingDoubled.substring(1) : '';

  if (!callBeingDoubled || callBeingDoubled === '-' || callBeingDoubled === 'R') {
    return;
  }

  if (callBeingDoubled !== 'D' && callBeingDoubled !== contract.highestBid) {
    return;
  }

  if (callBeingDoubled === 'D' && ((bidStack.count - bidStack.bids.indexOf(contract.highestBid)) % 2) !== 0) {
    return;
  }

  if (callBeingDoubled === 'D' && (bidStack.bids.indexOf(contract.highestBid) > bidStack.bids.lastIndexOf('D'))) {
    return;
  }

  // Redouble in very specific circumstances
  if (callBeingDoubled === 'D' && contract.doubled) {
    let suitOfConcern = '';

    [ 0, 4, 8, 12, 16, 20 ].forEach(multiple => {
      if (bidStack.bids[bidStack.count - (2 + multiple)] && isOpeningBid(contract, bidStack.bids[bidStack.count - (2 + multiple)])) {
        suitOfConcern = bidStack.bids[bidStack.count - (2 + multiple)][1];
      }
    });

    if (suitOfConcern && contract.highestBid[0] > '1') {
      if (goodSuit.indexOf(suitOfConcern) > -1) return 'R';
    }
  }
  else if (callBeingDoubled === 'D') {
    return;
  }

  // Double very high no trumps
  if (suitBeingDoubled === 'NT') {
    let aceCount = (aceSuit.length === 1 && kingSuit.length === 1) ? 1 : aceSuit.length;
    if (aceCount >= 1) aceCount += kingsPresent.length;
    if (parseInt(callBeingDoubled[0], 10) > 7 - aceCount) return 'D';
  }

  // Double very high trumps
  if (callBeingDoubled.length === 2) {
    let trumpCount = 0;
    if (aceSuit.indexOf(suitBeingDoubled) > -1) {
      trumpCount++;
      if (sd[suitBeingDoubled].all[1] && sd[suitBeingDoubled].all[1][0] === 'K') {
        trumpCount++;
        if (sd[suitBeingDoubled].all[2] && sd[suitBeingDoubled].all[2][0] === 'Q') {
          trumpCount++;
          if (sd[suitBeingDoubled].all[3] && sd[suitBeingDoubled].all[3][0] === 'J') {
            trumpCount++;
            trumpCount += sd[suitBeingDoubled].length - 4;
          }
        }
      }
    }
    if (parseInt(callBeingDoubled[0], 10) > 7 - trumpCount) return 'D';
  }

  // Double lower-stake trumps
  if (goodSuit.indexOf(suitBeingDoubled) > -1 && (callBeingDoubled[0] >= '3' || sd[suitBeingDoubled].count > 6)) {
    return 'D'
  }

  
}
