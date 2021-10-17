import { ApiDealtHands, ApiContract } from "./api/interfaces";
import { Opener } from "./erules/Opener";
import { may2ndOvercall, may4thOvercall } from "./erules/esoterics";
import { getBidStack, isOpeningBid, isResponseBid, isValidBid } from "./utility";
import { directionToKey, getSuitDictionary, StandardSuitDictionary } from "./shared";
import { Overcaller } from "./erules/Overcaller";
import { Responder } from "./erules/Responder";
import { Rebidder } from "./erules/Rebidder";
import { DefensiveDoubler } from "./erules/DefensiveDoubler";

interface EssenceRule {
  name: string;
  run: (cards: string[], contract: ApiContract, sd: StandardSuitDictionary, csv?: string[]) => string | void;
  check: (contract, dealtHands?) => boolean;
}

const rules: EssenceRule[] = [
  {
    name: 'Opener',
    run: Opener,
    check:  (contract) => isOpeningBid(contract)
  },
  {
    name: 'Overcaller',
    run: Overcaller,
    check: (contract) => may2ndOvercall(contract) || may4thOvercall(contract)
  },
  {
    name: 'Responder',
    run: Responder,
    check: (contract) => {
      const pResponse = isResponseBid(contract);
      return pResponse && isOpeningBid(contract, pResponse);
    }
  },
  {
    name: 'Rebidder',
    run: Rebidder,
    check: (contract) => {
      const bidStack = getBidStack(contract);
      const possibleOpening = bidStack.bids[bidStack.bids.length - 4];
      return bidStack.bids[bidStack.bids.length - 2] !== '-' &&
        possibleOpening &&
        isOpeningBid(contract, possibleOpening);
    }
  },
  {
    name: 'DefensiveDoubler',
    run: DefensiveDoubler,
    check: (contract) => contract.highestBid
  }
];

export function getComputerBid(dealtHands: ApiDealtHands, contract: ApiContract, csv?: string[]) {
  const cards = dealtHands[directionToKey[dealtHands.nextToPlay]];
  const suitDictionary = getSuitDictionary(cards);
  const result = rules.reduce((bid, rule) => {
    if (bid) return bid;
    if (rule.check(contract, dealtHands)) {
      const result = rule.run(cards, contract, suitDictionary, csv);
      if (result && isValidBid(result, contract)) {
        console.log(`rule: Essence's ${rule.name} recommends: ${result}`);
        return result;
      }
    }
    return '';
  }, '') || '-';
  if (result === '-') console.log(`rule: Essence recommends: PASS`);
  return result;
}
