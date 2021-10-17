import { ApiContract } from "../api/interfaces";
import { getCombinedPoints, getHighCardPoints, getLongestSuit, isBalanced, isGoodFive, isResponseBid, isValidBid } from "../utility";
import { allSuits, StandardSuitDictionary } from "../shared";

function haveStopper(suit: string, sd: StandardSuitDictionary) {
  const suitedSd = sd[suit];
  return suitedSd && (suitedSd.high[0] === 'A' ||
    (suitedSd.count > 1 && suitedSd.high[0] === 'K') ||
    (suitedSd.count > 2 && suitedSd.high[0] === 'Q') ||
    (suitedSd.count > 3 && suitedSd.high[0] === 'J'));
}

export function Responder(cards: string[], contract: ApiContract, sd: StandardSuitDictionary) {
  const opening = isResponseBid(contract);
  const pts = getCombinedPoints(sd);
  const pSuit = opening ? opening[1] : 'X';
  const hcp = getHighCardPoints(cards);

  // Respond 2D, 2H or 2S
  if (opening[0] === '2' && opening !== '2C' && opening !== '2NT') {

    if (hcp >= 16 && isBalanced(sd, true)) {
      const allStopped = allSuits.filter(x => x !== pSuit).reduce((acc, suit) => acc && haveStopper(suit, sd), true);
      if (allStopped) return '3NT';
    }

    if (pts >= 8) {
      
      if (opening[1] === 'D') {
          
        if (pts < 10) return;
        
        const goodSuits = allSuits.filter(suit => sd[suit] && (sd[suit].count >= 6 || isGoodFive(suit, sd)));
      
        if (goodSuits.length && pts >= 16 && isValidBid('2NT', contract)) {
          return '2NT';
        }
        else if (goodSuits.indexOf('H') > -1 && isValidBid('2H', contract)) {
          return '2H'
        }
        else if (goodSuits.indexOf('S') > -1 && isValidBid('2S', contract)) {
          return '2S'
        }
        else if (goodSuits.indexOf('D') > -1 && isValidBid('3D', contract)) {
          return '2D';
        }

        if (sd.D && sd.D.count >= 3) {
          return (pts >= 16) ? '2NT' : '2D';
        }
      
      }
      else {
      
        if (sd[pSuit] && sd[pSuit].count >= 3) {
          if (pts <= 13) {
            return `3${pSuit}`;
          }
          else if (pts <= 16) {
            return '2NT';
          }
          else if (pts <= 19) {
            return `4${pSuit}`;
          }
          else {
            return '2NT';
          }
        }
      
      }
    }
  }

  // Respond 2C
  if (opening === '2C') {
    if (hcp >= 8) {
      let longestSuit = getLongestSuit(sd);
      if (sd[longestSuit].count >= 5) {
        if (longestSuit === 'S' || longestSuit === 'H') {
          return `2${longestSuit}`;
        }
        else {
          return `3${longestSuit}`;
        }
      }
      if (isBalanced(sd)) {
        return '2NT'
      }
    }
    return '2D';
  }


  // Respond 2NT and 1NT
  if (opening === '2NT' || opening === '1NT') {
    if (hcp >= 7 && opening === '2NT') return '3NT';
    else if (hcp >= 7 && hcp <= 9 && isBalanced(sd, true) && opening === '1NT') return '2NT';
    else if (hcp > 9 && isBalanced(sd, true) && opening === '1NT') return '3NT';
    else return '-';
  }

  // Respond 1X - increase major
  if ((opening === '1S' || opening === '1H') && pts >= 8 && sd[pSuit] && sd[pSuit].count >= 3) {
    if (pts >= 16 && pts <= 22 && sd[pSuit] && sd[pSuit].count >= 4) {
      return `3${pSuit}`;
    }
    else if (pts >= 14 && pts < 16) {
      return `2${pSuit}`;
    }
  }

  // Respond 1X - bid new suit
  const unbidSuit = allSuits.find(x => sd[x] && sd[x].count >= 4);
  if ((opening === '1S' || opening === '1H' || opening === '1D' || opening === '1C') && pts >= 9 && unbidSuit) {
    if (unbidSuit === 'D' && pts >= 12 && pSuit === 'C') {
      if (sd.D.count >= 4 && (sd.D.count === 6 || sd.C?.count >= 4)) {
        return `2${unbidSuit}`;
      }
    }
    if (sd[unbidSuit].count >= 4) {
      return `2${unbidSuit}`;
    }
  }

  // Respond 1X - increase minor
  if ((opening === '1D' || opening === '1C') && sd[pSuit] && sd[pSuit].count >= 4) {
      if (pts >= 10 && (sd[pSuit].count > 4 || getHighCardPoints(cards) > 4)) {
        return `3${pSuit}`;
      }
  }

  // Respond 1X - bid NT
  if (opening[0] === 1 && pts >= 6) {

      if (pSuit === 'S' || pSuit === 'H') {
        if (hcp >= 12 && isBalanced(sd)) {
          if (hcp <= 15 && sd[pSuit] && sd[pSuit].count >= 4) {
            return '3NT';
          }
          else if (hcp >= 13) {
            return '2NT';
          }
        }
        else if (hcp <= 12) {
          return '1NT'
        }
      }
      else if (pSuit === 'D' || pSuit === 'C') {
        if (hcp >= 6 && hcp <= 10) {
          return '1NT';
        }
        else if (hcp >= 11 && hcp <= 12 && isBalanced(sd)) {
          return '2NT';
        }
        else if (hcp >= 13 && hcp <= 15 && isBalanced(sd)) {
          return '3NT';
        }
      }

  }
}