import { ApiContract } from "../api/interfaces";
import { getBidStack, getHighCardPoints, isGoodFive, isValidBid } from "../utility";
import { StandardSuitDictionary } from "../shared";

export function Rebidder(cards: string[], contract: ApiContract, sd: StandardSuitDictionary) {
  const bidStack = getBidStack(contract);
  const response = bidStack.bids[bidStack.bids.length - 2];
  const opening = bidStack.bids[bidStack.bids.length - 4];
  const hcp = getHighCardPoints(cards);
 
  // The following apply only to suited opening - we used to sometimes return 2N - which isn't a valid bid
  if (opening.length === 2) {

    // Analysis shows us major can often be increased in the rebid - alternately maybe we should have made our rsponse bid more aggressive
    if ((opening[1] === 'S' && response[1] === 'S') || (opening[1] === 'H' && response[1] === 'H')) {
      return `${parseInt(response[0], 10) + 1}${response[1]}`;
    }
    
    // If we have a lot of high card points, let's rebid to our opening suit
    if (opening[1] !== response[1] && hcp > 13) {
      return isValidBid(`${parseInt(response[0], 10)}${opening[1]}`, contract) ? `${parseInt(response[0], 10)}${opening[1]}` : `${parseInt(response[0], 10) + 1}${opening[1]}` ;
    }

    // If we have a lot at least three cards in their suit, let's rebid to their preferred suit (maybe if the overcall is much greater it'll fall through)
    if (opening[1] !== response[1] && sd[response[1]] && sd[response[1]].count >= 3 && bidStack.bids[bidStack.bids.length - 1].length === 2) {
      return `${parseInt(response[0], 10) + 1}${opening[1]}`;
    }

  }

  // In some circumstances, we'll head for 2NT
  if (response === '2S' && (opening === '1D' || opening === '1H') && ((sd.C && getHighCardPoints(sd.C.all) > 2) || hcp > 10)) {
    
    if (isGoodFive('D', sd)) {
      return isValidBid('2D', contract) ? '2D' : '3D';
    }
    else if (isGoodFive('H', sd)) {
      return isValidBid('2H', contract) ? '2H' : '3H';
    }
    else {
      return '2NT';
    }
  }

  /*
  const overcall = bidStack.bids[bidStack.bids.length - 3] || bidStack[bidStack.bids.length - 1];
  const decent = allSuits.map(s => isDecentFive(s, sd) ? '1' : '0').join(',');
  const good = allSuits.map(s => isGoodFive(s, sd) ? '1' : '0').join(',');
  const hcps = allSuits.map(s => sd[s] ? getHighCardPoints(sd[s].all) : '0').join(',');
  const counts = allSuits.map(s => sd[s] ? sd[s].all.length : '0').join(',');
  if (csv) csv[csv.length - 1] += `rebid,${opening},${overcall},${response},${hcp},${decent},${good},${hcps},${counts},`;
  */

}