
import { getComputerBid } from "../essence";
import { BiddingMessageEventBody } from "./interfaces";


onmessage = function(e: MessageEvent<BiddingMessageEventBody>) {
  const localDealtHands = JSON.parse(JSON.stringify(e.data.dealtHands));
  const localContract = e.data.contract ? JSON.parse(JSON.stringify(e.data.contract)) : undefined;
  const result = getComputerBid(localDealtHands, localContract || {
    north: [],
    east: [],
    south: [],
    west: [],
    highestBid: '',
    passCount: 0,
    doubled: false,
    redoubled: false
  });
  postMessage(result, undefined);
};

