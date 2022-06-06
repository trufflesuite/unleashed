# Unleash an NFT 🐰 🐶 🐱 🐭 🐹

In this tutorial, we will be creating a Bored Pets NFT smart contract for our Petaverse! The technologies we will be using are:

- Truffle
- Infura
- Metamask
- Web3.js

## Setup

First, we'll want to build our Petaverse by cloning the unleashed repository's [main branch](https://github.com/trufflesuite/unleashed/tree/main). We recommend cloning it into a folder called `erc20-token`. Follow the setup instructions [here]()

You should have:
1. The `unleashed` repository cloned

`git clone git@github.com:trufflesuite/unleashed.git`

2. Next install Truffle

`yarn install truffle -g`

3. Next install Ganache

`yarn install ganache -g`

Helpful, but optional:
- An [Infura](https://infura.io/) account and Project ID
- A [MetaMask](https://metamask.io/) account

Once you've gotten these installation requirements down, we can start building the NFT smart contract!

## Core Concepts

- A **NFT** (non-fungible token) is digital data that is stored on-chain. Unlike cryptocurrencies, which are *fungible* (aka your Bitcoin is the same as my Bitcoin), NFTs are one-of-a-kind.
- **ERC-721** defines the set of standards that make a token non-fungible. You can read more about it on Ethereum's website [here](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/).
- Every NFT will have a combination of a **`uint256 tokenId`** variable and contract address that must be globally unique.
- All the fun stuff about NFTs - the rarity, description, image, etc - is part of its **metadata**. In this tutorial, the NFT's **`string tokenURI`** will point to where the metadata is stored on [IPFS](https://ipfs.io/).

## Create the NFT smart contract

Creating an NFT smart contract is short and sweet! [OpenZeppelin](https://www.openzeppelin.com/contracts) contracts make it super easy. First, we'll want to change into our `packages/truffle` directory and add the OpenZeppelin dependency:

```bash
cd packages/truffle
yarn add @openzeppelin/contracts
```
Then, create a `BoredPetsNFT.sol` file under `packages/truffle/contracts`. :

```
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BoredPetsNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Bored Pets Yacht Club", "BPYC") {}

  function mint(string memory _tokenURI) public {
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, _tokenURI);
  }
}
```
Let's take a look at the imports:

- `@openzeppelin/contracts/token/ERC721/ERC721.sol`

The `BoredPetsNFT` implements the ERC-721 standard by inheriting the implementation of `ERC721URIStorage.sol`

- `@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol`

`ERC721URIStorage.sol` is an extension of `ERC721.sol`, which stores the `tokenURI` in `storage` (aka on-chain). If we did not use this extension, the `tokenURI` is derived by concatenating a `baseURI` and `tokenId`. However, we want to store the metadata on IPFS, which identifies content via a hash. Therefore, we cannot generate the `tokenURI` by using the `tokenId`. Instead, we must store the `tokenURI` on-chain to get that data.

To inherit from `ERC721URIStorage` we can use the Solidity `is` keyword by adding the following code:

```
BoredPetsNFT is ERC721URISTorage
```

- `@openzeppelin/contracts/utils/Counters.sol`

In order to guarantee each `tokenId` is unique, we will increment it by one each time an NFT is minted. We use `Counters.Counter private _tokenIds` to increment and track the value of `tokenId`.

Now, let's go over the methods:

- `constructor() ERC721("Bored Pets Yacht Club", "BPYC")`

The constructor is a function that can be executed upon contract creation. In this case, `constuctor()` indicates that this function is empty and does not run any contract initialization code. We then set our token collection name to "Bored Pets Yacht Club" and its symbol (abbreviated name) to "BPYC".

- `function mint(string memory _tokenURI) public`

This funtion is super straightforward! Every time we mint an NFT, we want to guarantee `tokenId` is unique by incrementing the counter by one. Then, we just call `_safeMint` to mint and store the `_tokenURI`!

## Write the deployment script

In order to deploy the smart contract, we'll need to write our migrations script. Create the file `1_deploy_contracts.js` under `packages/truffle/migrations`. Then, copy and paste the code below:

```javascript
const BoredPetsNFT = artifacts.require("BoredPetsNFT");

module.exports = function (deployer) {
  deployer.deploy(BoredPetsNFT);
};
```
`artifacts.require` is how we tell Truffle which contracts we'd like to interact with and returns a contract abstraction that we can use in the rest of our deployment script. NOTE: The name should match the contract name (`BoredPetsNFT`) and NOT the filename (`BoredPetsNFT.sol`).

## Deploy the NFT smart contract

This tutorial outlines how to deploy with Infura, but Truffle has great features to speed up local testing:

1. Use Dashboards so you don't have to expose your private key
2. Use [Ganache's forking feature](https://trufflesuite.com/blog/introducing-ganache-7/#1-zero-config-mainnet-forking), which allows you to simulate the state of mainnet or testnets, to test using real data and interact with contracts locally


### Using Truffle Dashboard (recommended)

Truffle Dashboard ships with Truffle and can be started with `truffle dashboard`. This in turn loads the dashboard at http://localhost:24012 and beyond that you'll just need to run your migration (`truffle migrate`). A more detailed guide to using Truffle Dashboard is available [here](https://trufflesuite.com/blog/introducing-truffle-dashboard/).

### Using the env File

You will need at least one mnemonic to use with the network. The `.dotenv` npm package has been installed for you, and you will need to create a `.env` file for storing your mnemonic and any other needed private information.

The `.env` file is ignored by git in this project, to help protect your private data. In general, it is good security practice to avoid committing information about your private keys to github. The `truffle-config.js` file expects a `MNEMONIC` value to exist in `.env` for running commands on each of these networks, as well as a default `MNEMONIC` for the Arbitrum network we will run locally.

If you are unfamiliar with using `.env` for managing your mnemonics and other keys, the basic steps for doing so are below:

1) Use `touch .env` in the command line to create a `.env` file at the root of your project.
2) Open the `.env` file in your preferred IDE
3) Add the following, filling in your own Infura project key and mnemonics:

```
INFURA_KEY="<Your Infura Project ID>"
GOERLI_MNEMONIC="<Your Goerli Mnemonic>"
MAINNET_MNEMONIC="<Your Mainnet Mnemonic>"
```

...

## Community and Support

Loved this tutorial and want to share with the Truffle community? Join our Discord and Reddit communities. Also, follow our Twitter [@trufflesuite](https://twitter.com/trufflesuite) or join our monthly community calls to stay up-to-date with the latest on all things Truffle.

- [Discord](https://discord.com/invite/vbx6jy6XC8)
- [Reddit](https://www.reddit.com/r/Truffle/)

If you need help, find us on Github discussions!
- [Truffle Support](https://github.com/orgs/trufflesuite/discussions)
- [Ganache Support](https://github.com/orgs/trufflesuite/discussions/5121)

Lastly, if you you've discovered a bug, please let us know by creating an issue and/or creating a Pull Request with any fixes or contributions - All Truffle resources are open source :)
- [Truffle Github Org](https://github.com/trufflesuite)

## License

[MIT](./LICENSE)
