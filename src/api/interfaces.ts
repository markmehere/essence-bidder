export const directionToKey = {
  N: 'north',
  E: 'east',
  S: 'south',
  W: 'west'
};

export enum ApiDirection {
  North = 'N',
  East = 'E',
  South = 'S',
  West = 'W'
}

export interface ApiContract {
  west: string[];
  north: string[];
  east: string[];
  south: string[];
  highestBid: string;
  declarer?: ApiDirection;
  dummy?: ApiDirection;
  doubled: boolean;
  redoubled: boolean;
  passCount: number;
}

export interface ApiDealtHands {
  west: string[];
  pwest: string[];
  north: string[];
  pnorth: string[];
  east: string[];
  peast: string[];
  south: string[];
  psouth: string[];
  northsouthwon: ApiTrickCards[];
  eastwestwon: ApiTrickCards[];
  nextToPlay: ApiDirection;
  playedCards: string[];
  winningCards: string[];
}

export interface ApiTrickCards {
  opening: string;
  west: string;
  north: string;
  east: string;
  south: string;
  order: ApiDirection[];
  done: boolean;
}

export interface BiddingMessageEventBody {
  dealtHands: ApiDealtHands;
  contract?: ApiContract;
}
