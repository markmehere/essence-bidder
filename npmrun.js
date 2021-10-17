const bidWorker = require("./bin/essence-bidding");

const allSuits = [ 'S', 'H', 'D', 'C' ];
const allNominations = [ 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2' ];
const allCardsString = allSuits.map(suit => {
  return allNominations.map(nom => nom + suit);
}).join();
const allCards = allCardsString.split(',');
const cardSort = (a, b) => {
  return allCards.indexOf(a) - allCards.indexOf(b);
};
const preShuffleCards = allCardsString.split(',');
const shuffledCards = [];
for (let i = 0; preShuffleCards.length > 0; i++) {
  shuffledCards.push(preShuffleCards.splice(Math.random() * preShuffleCards.length, 1)[0]);
}
const westCards = shuffledCards.splice(0, 13);
const northCards = shuffledCards.splice(0, 13);
const eastCards = shuffledCards.splice(0, 13);
const southCards = shuffledCards.splice(0, 13);
westCards.sort(cardSort);
northCards.sort(cardSort);
eastCards.sort(cardSort);
southCards.sort(cardSort);
let dealtHands = {
  north: northCards,
  east: eastCards,
  south: southCards,
  west: westCards,
  nextToPlay: 'N'
};

console.log(`north: ${JSON.stringify(dealtHands.north)}`);
console.log(`east: ${JSON.stringify(dealtHands.east)}`);
console.log(`south: ${JSON.stringify(dealtHands.south)}`);
console.log(`west: ${JSON.stringify(dealtHands.west)}`);

console.log("");
console.log("North commences the bidding...");
console.log("");

let contract = {
  north: [],
  west: [],
  south: [],
  east: [],
  highestBid: '',
  doubled: false,
  redoubled: false,
  passCount: 0
};

global.postMessage = (bid) => {
  switch (dealtHands.nextToPlay) {
    case 'N':
      contract.north = contract.north.concat(bid);
      message = `East ${JSON.stringify(dealtHands.east)}`;
      dealtHands.nextToPlay = 'E';
      break;
    case 'E':
      contract.east = contract.east.concat(bid);
      message = `South ${JSON.stringify(dealtHands.south)}`;
      dealtHands.nextToPlay = 'S';
      break;
    case 'S':
      contract.south = contract.south.concat(bid);
      message = `West ${JSON.stringify(dealtHands.west)}`;
      dealtHands.nextToPlay = 'W';
      break;
    case 'W':
      contract.west = contract.west.concat(bid);
      message = `North ${JSON.stringify(dealtHands.north)}`;
      dealtHands.nextToPlay = 'N';
      break;
  }
  if (bid === '-') contract.passCount++;
  else contract.passCount = 0;
  if (bid !== '-' && bid !== 'D' && bid !== 'R') {
    contract.doubled = false;
    contract.redoubled = false;
    contract.highestBid = bid;
  }
  else if (bid === 'D') {
    contract.doubled = true;
  }
  else if (bid === 'R') {
    contract.redoubled = true;
  }
};

console.log(`North ${JSON.stringify(dealtHands.north)}`);
while ((!contract.highestBid || contract.passCount < 3) && contract.passCount < 4) {
  global.onmessage({ data: { dealtHands, contract } });
  console.log(message);
}

console.log("");
console.log(contract.highestBid ? `The contract is ${contract.highestBid}` : `The hand was passed out`);
