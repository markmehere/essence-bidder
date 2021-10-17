import { ApiContract } from "../api/interfaces";
import { getBidStack, haveStopper, getHighCardPoints, isBalanced, getCombinedPoints, isValidBid, NomIndex, isGoodFive } from "../utility";
import { allSuits, allSuitsReverse, getRankIndex, StandardSuitDictionary } from "../shared";
import { may4thOvercall } from "./esoterics";

function getEnemyTrumps(contract: ApiContract) {
  const bidStack = getBidStack(contract);
  
  return bidStack.bids.reverse()
    .reduce((acc, bid) => (bid[1] && acc.indexOf(bid[1]) === -1) ? acc.concat(bid[1]) : acc, [])
    .map(x => x === 'N' ? 'NT' : x);
}

export function haveStopperInEnemySuit(contract: ApiContract, sd: StandardSuitDictionary) {
  const enemyTrumps = getEnemyTrumps(contract);
  return enemyTrumps.indexOf('NT') !== -1 || enemyTrumps.find(x => haveStopper(x, sd));
}

export function Overcaller(cards: string[], contract: ApiContract, sd: StandardSuitDictionary, csv) {
  const hcp = getHighCardPoints(cards);
  const pts = getCombinedPoints(sd);

  const bidStack = getBidStack(contract);
  const overcall = bidStack.bids[bidStack.bids.length - 2];
  const response = bidStack.bids[bidStack.bids.length - 1];
  if (may4thOvercall(contract) && overcall !== '-') {

    // If we're responding to an overcall change suit if we have a good suit
    const goodSuit = allSuits.find(s => isGoodFive(s, sd));
    if (goodSuit && isValidBid(`2${goodSuit}`, contract)) return `2${goodSuit}`;
    if (goodSuit && isValidBid(`3${goodSuit}`, contract)) return `3${goodSuit}`;
    
    // If we're responding to a suited overcall go one-up if we have a good HCP and need to
    if (hcp >= 10 && (hcp >= 12 || response.length === 2) && overcall.substring(1) !== 'NT') {
      if (isValidBid(`2${overcall.substring(1)}`, contract)) return `2${overcall.substring(1)}`;
      if (isValidBid(`3${overcall.substring(1)}`, contract)) return `3${overcall.substring(1)}`;
    }

    // If we're responding to a 1NT overcall go one-up if we have a good HCP
    if (hcp >= 10 && (hcp >= 12 || response.length === 2) && overcall === '1NT') {
      return '2NT';
    }
  }

  // Overcall 1NT
  if ((hcp >= 10 && hcp <= 15) && isBalanced(sd) && haveStopperInEnemySuit(contract, sd)) {
    return '1NT';
  }

  // Overcall 2NT
  if (hcp >= 16 && isBalanced(sd) && haveStopperInEnemySuit(contract, sd)) {
    return '2NT';
  }

  // Overcall suit
  if (pts >= 10) {
    const tier1 = allSuitsReverse.filter(x => sd[x] && sd[x].count >= 6 && getRankIndex(sd[x].high) >= NomIndex.J && isValidBid(`1${x}`, contract)).map(x => `1${x}`);
    const tier2 = allSuitsReverse.filter(x => sd[x] && sd[x].count >= 5 && getRankIndex(sd[x].high) >= NomIndex.J && getRankIndex(sd[x].all[1]) >= NomIndex.J && isValidBid(`2${x}`, contract)).map(x => `2${x}`);
    return tier1.concat(tier2)[0];
  }
}
