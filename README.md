# essence-bidder

#### By Mark Pazolli

A simple open source bidder for contract bridge.

## Testing

To run tests:

```
npm install
npm test
```

## Building

To build the web worker and bid a random hand:

```
npm install
npm start
```

## Running

To quickly bid another random hand after building:

```
node npmrun.js
```

## Run in browser

You will need to pick/modify the last line depending upon your platform:

```
npm install
npm start
google-chrome --allow-file-access-from-files example.html # linux
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files example.html # mac os x
start chrome --allow-file-access-from-files # windows line 1
start chrome file:///C:/essence-bidder/example.html #windows line 2
```

Started with file access, the browser should bid a random hand.

## How was the agent built?

Some simple conventions were picked to determine the opening, first
overcall and first response.

A hand was then played with each trump and no trumps. Based on this
rules were determined for the rebid and second overcall.

That is, if the optimal contract was known as well as the opening
and response. Then the rebid is simply the bid that reaches the
optimal contract (A + B + X = C).

The doubling was built by doubling contracts I thought extremely
improbable to succeed. Most times it should be correct.

## How can I use my custom bidding agent with Free Bridge?

The bridge assistant in the game (see the light bulb in the bottom right)
should offer you some tips.

## Is the play engine or Free Bridge open source too?

No. There is a playing agent available as part of [gnubridge-ts](https://github.com/markmehere/gnubidder-ts).
It is not the playing agent used by Free Bridge and it is not
available under the MIT license.

## Allowed uses

The bidding agent is licensed under the MIT license - which allows
you a great deal of flexibility. There is no real reason to mess
around with web workers (although Free Bridge does), you can
just incorporate it in your code and include the copyright
message where suitable.

## License

Copyright (c) 2021 Mark Pazolli

Distributed under the terms of the MIT license
