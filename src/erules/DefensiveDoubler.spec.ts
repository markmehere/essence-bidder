import { getSuitDictionary } from "../shared";
import { DefensiveDoubler } from "./DefensiveDoubler";

describe('DefensiveDoubler', () => {

  it('should redouble 1', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C', '9C', '8C' ],
     {
       north: [ '1C', '-' ],
       east: [ '-', '-' ],
       south: [ '2C' ],
       west: [ 'D' ],
       highestBid: '2C',
       doubled: true,
       redoubled: false,
       passCount: 2
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C', '9C', '8C' ])
    )).toBe('R');
  });

  it('should redouble 2', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C', '9C', '8C' ],
     {
       north: [ '1C', '-', '-' ],
       east: [ '-', '-', 'D' ],
       south: [ '2C', '4C' ],
       west: [ '-', '-' ],
       highestBid: '4C',
       doubled: true,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C', '9C', '8C' ])
    )).toBe('R');
  });

  it('should not redouble 1', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C', '9C', '8C' ],
     {
       north: [ '1C', '-', '5C' ],
       east: [ '-', '-', '-' ],
       south: [ '2C', '4C' ],
       west: [ '-', 'D' ],
       highestBid: '5C',
       doubled: true,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C', '9C', '8C' ])
    )).toBeUndefined();
  });
  
  it('should not redouble 2', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ '1C', '-', '5C' ],
       east: [ '-', '-', '-' ],
       south: [ '2C', '4C' ],
       west: [ '-', 'D' ],
       highestBid: '5C',
       doubled: true,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBeUndefined();
  });
  
  it('should double crazy no trump 1', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '7NT' ],
       south: [ ],
       west: [ ],
       highestBid: '7NT',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBe('D');
  });
  
  it('should double crazy no trump 2', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '6NT' ],
       south: [ ],
       west: [ ],
       highestBid: '6NT',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBe('D');
  });
  
  it('should double crazy no trump 3', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '5NT' ],
       south: [ ],
       west: [ ],
       highestBid: '5NT',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBe('D');
  });
  
  it('should double crazy no trump 4', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '4NT' ],
       south: [ ],
       west: [ ],
       highestBid: '4NT',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBe('D');
  });
  
  it('should not double crazy no trump', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '3NT' ],
       south: [ ],
       west: [ ],
       highestBid: '3NT',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBeUndefined();
  });
  
  it('should double crazy 7S', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '7S' ],
       south: [ ],
       west: [ ],
       highestBid: '7S',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBe('D');
  });
  
  
  it('should not double crazy 6S', () => {
    expect(DefensiveDoubler(
      [ 'AS', 'JS', '10S', '7S', 'KH', 'QH', '9H', '8H', '5D', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '6S' ],
       south: [ ],
       west: [ ],
       highestBid: '6S',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', 'KH', 'QH', '9H', '8H', '5D', 'AC', 'KC', '10C', '9C' ])
    )).toBeUndefined();
  });

  it('should double crazy 6C', () => {
    expect(DefensiveDoubler(
      [ 'AS', 'JS', '10S', '7S', 'KH', 'QH', '9H', '8H', '5D', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ', '-' ],
       east: [ '2C', '6C' ],
       south: [ '-' ],
       west: [ '4C' ],
       highestBid: '6C',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', 'KH', 'QH', '9H', '8H', '5D', 'AC', 'KC', '10C', '9C' ])
    )).toBe('D');
  });
  
  it('should not double crazy 5C', () => {
    expect(DefensiveDoubler(
      [ 'AS', 'JS', '10S', '7S', 'KH', 'QH', '9H', '8H', '5D', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ', '-' ],
       east: [ '2C', '5C' ],
       south: [ '-' ],
       west: [ '4C' ],
       highestBid: '5C',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', 'KH', 'QH', '9H', '8H', '5D', 'AC', 'KC', '10C', '9C' ])
    )).toBeUndefined();
  });
  
  it('should not double 2S', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '2S' ],
       south: [ ],
       west: [ ],
       highestBid: '2S',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBeUndefined();
  });
  
  it('should double 3S', () => {
    expect(DefensiveDoubler(
     [ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ],
     {
       north: [ ' ' ],
       east: [ '3S' ],
       south: [ ],
       west: [ ],
       highestBid: '3S',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '2S', 'KH', 'QH', '9H', '8H', 'AC', 'KC', '10C', '9C' ])
    )).toBe('D');
  });
  
  it('should double longer 2S', () => {
    expect(DefensiveDoubler(
    [ 'AS', 'JS', '10S', '7S', '3S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C' ],
     {
       north: [ ' ' ],
       east: [ '2S' ],
       south: [ ],
       west: [ ],
       highestBid: '2S',
       doubled: false,
       redoubled: false,
       passCount: 0
     },
     getSuitDictionary([ 'AS', 'JS', '10S', '7S', '4S', '3S', '2S', 'KH', 'QH', '9H', 'AC', 'KC', '10C' ])
    )).toBe('D');
  });
});