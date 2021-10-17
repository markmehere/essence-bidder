/* This file only under CC0 - public domain */

import { ApiContract, ApiDealtHands, ApiDirection, ApiTrickCards } from "./api/interfaces";

export type SuitDictionary<T> = { S?: T, H?: T, D?: T, C?: T };
export type StandardSuitDictionary = SuitDictionary<{ high: string; low: string; count: number; all: string[] }>;

export const directionToKey = {
  N: 'north',
  E: 'east',
  S: 'south',
  W: 'west'
};

export const allDirections = [ ApiDirection.North, ApiDirection.East, ApiDirection.South, ApiDirection.West ];
export const allSuits = [ 'S', 'H', 'D', 'C' ];
export const allSuitsReverse = [ 'C', 'D', 'H', 'S' ];
export const allNominations = [ 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2' ];
export const allNominationsReverse = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ];

export interface WinningCard {
  direction: ApiDirection;
  card: string;
  internalpts: number;
}

export const getSuit = (x: string) => x[x.length - 1];
export const getNomination = (x: string) => x.substring(0, x.length - 1);
export const getRankIndex = (x: string) => !x ? -1 : allNominationsReverse.indexOf(x.substring(0, x.length - 1));
export const getSuitDictionary = (cards: string[]) => cards.reduce((acc, val) => {
  const suit = getSuit(val);
  if (!acc[suit]) acc[suit] = { low: val, high: val, all: [ val ], count: 1 };
  else {
    acc[suit].low = val;
    acc[suit].all.push(val);
    acc[suit].count++;
  }
  return acc;
}, {});

export function getOpposite(direction: ApiDirection) {
  if (direction === ApiDirection.North) return ApiDirection.South;
  else if (direction === ApiDirection.East) return ApiDirection.West;
  else if (direction === ApiDirection.South) return ApiDirection.North;
  return ApiDirection.East;
}

export function getNext(direction: ApiDirection) {
  if (direction === ApiDirection.North) return ApiDirection.East;
  else if (direction === ApiDirection.East) return ApiDirection.South;
  else if (direction === ApiDirection.South) return ApiDirection.West;
  return ApiDirection.North;
}

export function getPossibleMoves(dealtHands: ApiDealtHands, currentTrick?: ApiTrickCards): string[] {
  const key = directionToKey[dealtHands.nextToPlay];
  if (!currentTrick) return dealtHands[key];
  if (!currentTrick.south && !currentTrick.north && !currentTrick.east && !currentTrick.west) return dealtHands[key];
  const proposed = dealtHands[key].filter(c => c[c.length - 1] === currentTrick.opening[currentTrick.opening.length - 1]);
  if (proposed.length) return proposed;
  return dealtHands[key];
}

export function getWinner(trick: ApiTrickCards, contract: ApiContract): WinningCard {
  const openingSuit = trick.opening[trick.opening.length - 1];
  const candidates: WinningCard[] = allDirections.map(d => {
    const card = trick[directionToKey[d]] || '';
    if (getSuit(card) === getSuit(contract.highestBid)) {
      return {
        card: card,
        direction: d,
        internalpts: 40 - allNominations.findIndex(n => n === card.substring(0, card.length - 1))
      };
    }
    else if (getSuit(card) === openingSuit) {
      return {
        card: card,
        direction: d,
        internalpts: 20 - allNominations.findIndex(n => n === card.substring(0, card.length - 1))  
      };
    }
    else {
      return {
        card: card,
        direction: d,
        internalpts: 0
      };
    }
  });
  return candidates.sort((a, b) => b.internalpts - a.internalpts)[0];
}

export function cheapAddToTrick(dealtHands: ApiDealtHands, currentTrick: ApiTrickCards, move: string) {
  const moveDir = dealtHands.nextToPlay;
  const moveDirKey = directionToKey[moveDir];
  return {
    dealtHands: {
      ...dealtHands,
      nextToPlay: getNext(dealtHands.nextToPlay)
    },
    currentTrick: {
      ...currentTrick,
      [moveDirKey]: move
    }
  }
}

export function addToTrick(dealtHands: ApiDealtHands, currentTrick: ApiTrickCards, contract: ApiContract, move: string) {
  const moveDir = dealtHands.nextToPlay;
  const moveDirKey = directionToKey[moveDir];
  const pMoveDirKey = `p${moveDirKey}`;
  if (currentTrick.order.length === 3) {
    const newCurrentTrick = {
      ...currentTrick,
      [moveDirKey]: move,
      order: currentTrick.order.concat(moveDir),
      done: true
    };
    const winner = getWinner(newCurrentTrick, contract);
    return {
      dealtHands: {
        ...dealtHands,
        nextToPlay: winner.direction,
        winningCards: dealtHands.winningCards.concat(winner.card),
        playedCards: dealtHands.playedCards.concat(move),
        [moveDirKey]: dealtHands[moveDirKey].filter(x => x !== move),
        [pMoveDirKey]: dealtHands[pMoveDirKey].concat(move),
        northsouthwon: (winner.direction === 'N' || winner.direction === 'S') ? dealtHands.northsouthwon.concat(newCurrentTrick) : dealtHands.northsouthwon,
        eastwestwon: (winner.direction === 'E' || winner.direction === 'W') ? dealtHands.eastwestwon.concat(newCurrentTrick) : dealtHands.eastwestwon
      },
      currentTrick: newCurrentTrick
    };
  }
  return {
    dealtHands: {
      ...dealtHands,
      nextToPlay: getNext(dealtHands.nextToPlay),
      playedCards: dealtHands.playedCards.concat(move),
      [moveDirKey]: dealtHands[moveDirKey].filter(x => x !== move),
      [pMoveDirKey]: dealtHands[pMoveDirKey].concat(move)
    },
    currentTrick: {
      ...currentTrick,
      opening: currentTrick.opening || move,
      [moveDirKey]: move,
      order: currentTrick.order.concat(moveDir)
    }
  };
}

/* End CC0 */
