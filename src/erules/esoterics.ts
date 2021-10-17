import { ApiContract } from "../api/interfaces";
import { getBidStack } from "../utility";

export function may2ndOvercall(contract: ApiContract) {
  const bidStack = getBidStack(contract);
  if (bidStack.count === 0 || bidStack.count > 6) {
    return false;
  }
  const opening = bidStack.bids[bidStack.count - 1];
  const openingIndex = bidStack.bids.indexOf(opening);
  return opening && opening[0] === '1' && openingIndex <= 3 &&
    bidStack.bids.slice(0, openingIndex).filter(x => x !== '-').length === 0;
}

export function may4thOvercall(contract: ApiContract) {
  const bidStack = getBidStack(contract);
  if (bidStack.count === 0 || bidStack.count > 6) {
    return false;
  }
  const opening = bidStack.bids[bidStack.count - 3];
  const openingIndex = bidStack.bids.indexOf(opening);
  return opening && opening[0] === '1' && openingIndex <= 3 &&
    bidStack.bids.slice(0, openingIndex).filter(x => x !== '-').length === 0;
}
