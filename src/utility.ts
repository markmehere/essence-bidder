import { ApiContract } from "./api/interfaces";
import { allDirections, allSuits, directionToKey, getNomination, getRankIndex, StandardSuitDictionary } from "./shared";

export enum NomIndex {
  A=12,
  K=11,
  Q=10,
  J=9,
  T = 8
};

export function isOpeningBid(contract: ApiContract, limit?: string) {
  if (limit === '-' || limit === 'D' || limit === 'R') return false;
  if (limit) {
    const bidStack = getBidStack(contract);
    const aIsEmptyString = bidStack.bids.slice(0, bidStack.bids.indexOf(limit)).join('').replace(/\-/g, ' ').trim();
    return !aIsEmptyString;
  }
  const isEmptyString = (contract.north.join('') + contract.east.join('') + contract.south.join('') + contract.west.join('')).replace(/\-/g, ' ').trim();
  return !isEmptyString;
}

export function getBidCount(contract: ApiContract) {
  const trimmedString = (contract.north.map(x => x !== ' ' ? 'x' : '').join('') + contract.east.map(x =>  x !== ' ' ? 'x' : '').join('') + contract.south.map(x =>  x !== ' ' ? 'x' : '').join('') + contract.west.map(x => x !== ' ' ? 'x' : '').join(''));
  return trimmedString.length;
}

export function getBidStack(contract: ApiContract) {
  const flatten = (acc, val) => acc.concat(val);
  const bidStack = contract.north.map((ignore, level) => allDirections.map(dir => contract[directionToKey[dir]][level] ? contract[directionToKey[dir]][level] : ' ')).reduce(flatten, []);
  const dirStack = bidStack.map((x, i) => x === ' ' ? ' ' : allDirections[i % 4]);
  const bids = bidStack.join(' ').trim().split(' ');
  const directions = dirStack.join(' ').trim().split(' ')
  return {
    bids,
    directions,
    count: bids.length
  };
}

export function getHighCardPoints(cards: string[]) {
  return cards.reduce((acc, card) => {
    switch (getNomination(card)) {
      case 'A':
        return acc + 4;
      case 'K':
        return acc + 3;
      case 'Q':
        return acc + 2;
      case 'J':
        return acc + 1;
      default:
        return acc;
    }
  }, 0);
}

export function isBalanced(sd: StandardSuitDictionary, semi?: boolean) {
  const voids = allSuits.reduce((acc, val) => acc || !sd[val], false);
  const singletons = allSuits.reduce((acc, val) => acc || (sd[val] && sd[val].count === 1), false);
  const doubletons = allSuits.reduce((acc, val) => acc + (sd[val] && sd[val].count === 2 ? 1 : 0), 0);
  if (semi) return !(voids || singletons);
  return !(doubletons >= 2 || singletons || voids);
}

export function distributionalValue(suit: string, sd: StandardSuitDictionary) {
  const count = sd[suit]?.count || 0;
  switch (count) {
    case 0:
      return 3;
    case 1:
      return 2;
    case 2:
      return 1;
  }

  return 0;
}

export function getCombinedPoints(sd: StandardSuitDictionary) {
  return allSuits.reduce((acc, suit) => {
    let increment = sd[suit] ? getHighCardPoints(sd[suit].all) : 0;
    if (!isFlawed(suit, sd)) {
      increment += distributionalValue(suit, sd);
    }
    return acc + increment;
  }, 0);
}

export function isFlawed(suit: string, sd: StandardSuitDictionary) {
  if (sd[suit] && sd[suit].count === 1) {
    const nom = getNomination(sd[suit].high);
    return (nom === 'K' || nom === 'Q' || nom === 'J');
  }
  else if (sd[suit] && sd[suit].count === 2) {
    const nom = getNomination(sd[suit].high);
    const lowNom = getNomination(sd[suit].low);
    return (nom === 'K' && (lowNom === 'Q' || lowNom === 'J'));
  }

  return false;
}

export function isValidBid(bid: string, contract: ApiContract) {
  if (!bid) return false;
  if (!/^[-|R|D]|([1-7]([C|H|D|S]|NT))$/.test(bid)) {
    console.warn(`Unexpected bid: ${bid}`);
    return false;
  }
  if (bid === 'D' && (!contract.highestBid || contract.doubled || contract.redoubled)) return false;
  if (bid === 'R' && (!contract.highestBid || !contract.doubled)) return false;
  if (bid === 'D' || bid === 'R') return true;
  if (!contract.highestBid) return true;
  if (bid[0] > contract.highestBid[0]) return true;
  if (bid[0] < contract.highestBid[0]) return false;
  if (bid.substring(1) === 'NT' && contract.highestBid.substring(1) !== 'NT') return true;
  if (contract.highestBid.substring(1) === 'NT') return false;
  return bid > contract.highestBid;
}

export function getLongestSuit(sd: StandardSuitDictionary) {
  return allSuits.reduce((acc, suit) => {
    if (!acc || !sd[acc]) return suit;
    if (sd[suit] && sd[suit].count > sd[acc].count) return suit;
    return acc;
  }, '');
}

export function isResponseBid(contract: ApiContract) {
  const bidStack = getBidStack(contract);
  const partnerCall = bidStack.bids[bidStack.count - 2];
  if (partnerCall && partnerCall !== '-' && partnerCall !== 'D' && partnerCall !== 'R') {
    const myOpening = bidStack.bids[bidStack.count - 4];
    if (!myOpening || myOpening === '-') {
      return partnerCall;
    }
  }
  return false;
}

export function isGoodFive(suit: string, sd: StandardSuitDictionary) {
  return (sd[suit] && sd[suit].count >= 5 && getRankIndex(sd[suit].high) >= NomIndex.Q && getRankIndex(sd[suit].all[1]) >= NomIndex.J);
}

export function isDecentFive(suit: string, sd: StandardSuitDictionary) {
  return (sd[suit] && sd[suit].count >= 5 && getRankIndex(sd[suit].high) >= NomIndex.J && getRankIndex(sd[suit].all[1]) >= NomIndex.T);
}

export function haveStopper(suit: string, sd: StandardSuitDictionary) {
  const suitedSd = sd[suit];
  return suitedSd && (suitedSd.high[0] === 'A' ||
    (suitedSd.count > 1 && suitedSd.high[0] === 'K') ||
    (suitedSd.count > 2 && suitedSd.high[0] === 'Q') ||
    (suitedSd.count > 3 && suitedSd.high[0] === 'J'));
}
