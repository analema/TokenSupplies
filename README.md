# ERC20 Token Supply API

A little quick helper for tokens to build an API to provide endpoints that provide Total and Circulating supplies for a token, for systems such as [CoinMarketCap](https://coinmarketcap.com) and [CoinGecko](https://coingecko.com).

```
What is the difference between "Circulating Supply", "Total Supply", and "Max Supply"?

Circulating Supply is the best approximation of the number of coins that are circulating in the market and in the general public's hands.

Total Supply is the total amount of coins in existence right now (minus any coins that have been verifiably burned).
Max Supply is the best approximation of the maximum amount of coins that will ever exist in the lifetime of the cryptocurrency.
```

## Prerequisites

### Node

To be able to run this package you'll require Node JS on your local system. If you don't currently have Node on your machine check out [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to get started.

### CloudFlare

This API is built and runs on CloudFlare Workers [workers.cloudflare.com](https://workers.cloudflare.com/), the free tier should suffice for this API if you don't already have a CloudFlare account. You will first need to sign up to workers as well follow CloudFlare's own documentation here <https://developers.cloudflare.com/workers/get-started/guide#1-sign-up-for-a-workers-account>

## Getting Started

You will note the file [info.json](src/info.json) this is where the basic information of your token will live. As an example we have used the ANJI token information.

### Balances

The balances param within the JSON object should contain all of the wallets that should be ommited from your circulating supply. Removing wallets such as dead wallet, developer wallets and liquidity pool wallets.

### Endpoint

The endpoint param within the JSON object should be a `https` endpoint that provides data for the blockchain.

Such as:
- Polygon : https://polygon-rpc.com
- Ethereum : https://cloudflare-eth.com

Now one big *gotcha* for BSC and some data endpoints is they will block some IP's such as CloudFlare for this reason if your token is on the BSC network we suggest using [Moralis.io](https://moralis.io/) you can sign up for free and use the free tier for this API using their [Speedy Nodes](https://docs.moralis.io/speedy-nodes/what-are-speedy-nodes) option. Once you create your account and get your BSC Speedy Node url simply add this to the value for the `endpoint` param.

### Token

Finally you'll see the token param containing some basic information of your token `address`, `supply` & `decimals`. The address should be the contract address for the token, supply being the full max supply (before burns etc) and decimals be the decimals set for the token.

### Running

Now that we have all this information setup we can get going. By installing and running the project.

Install the dependencies of the project using
```
npm install
```

Login to your personal Cloudflare
```
npm run wlogin
```

Run locally
```
npm start
```

Once the command completes you'll see
```
👂  Listening on http://127.0.0.1:8787
```

You can now visit your API locally

- Circulating Supply : http://127.0.0.1:8787/circulating
- Total Supply : http://127.0.0.1:8787/total

Once you have verified this is all correct you can simply deploy your API to Cloudflare using.

```
npm run deploy
```

This will deploy directly to your CloudFlare account a worker whilst returning a URL in which the API runs from something like

```
✨  Build completed successfully!
✨  Successfully published your script to
 https://tokensupplies.my-worker.workers.dev
```
