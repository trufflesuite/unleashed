# Unleash a ERC20 Token 🐰 🐶 🐱 🐭 🐹

In this tutorial, we will be creating an ERC20 token contract for our Petaverse! The technologies we will be using are:

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

Once you've gotten these installation requirements down, we can start building the Token smart contract!

## Core Concepts

- A **Token**  is used to represent fungible goods. Fungible goods are equivalent and interchangeable. Therefore, each token is exactly the same, with no token having any special behavior attached to it. Examples of fungible goods are Ether, fiat currencies like the US Dollar or Euro, and voting rights. ERC-20 tokens are useful for assets like currencies, voting rights, points in a game, and more. In general, with fungible assets, you care about how much of it you have.
- **ERC-20** defines the set of standards that make a token fungible. You can read more about it on Ethereum's website [here](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/).
- Every token will have a combination of a **`uint256 tokenId`** variable and contract address that must be globally unique.

## Create the ERC20 smart contract

Creating a ERC20 smart contract is short and sweet! [OpenZeppelin](https://www.openzeppelin.com/contracts) contracts make it super easy. First, we'll want change into our `packages/truffle` directory and add the OpenZeppelin dependency:

```bash
cd packages/truffle
yarn add @openzeppelin/contracts
```
Then, create a `BoredPetsERC20.sol` file under `packages/truffle/contracts`. :

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoredPets is ERC20, Ownable {
    constructor() ERC20("BoredPets", "BP") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

```
Let's take a look at the imports:

- `@openzeppelin/contracts/token/ERC20/ERC20.sol`

To be a valid token, `BoredPetsERC20` implements the ERC-20 standard by inheriting the implementation of `ERC20.sol`.

- `@openzeppelin/contracts/token/ERC20/ERC20.sol`

Openzeppelins contracts are used via inheritance. In this example we are inheriting `ERC20.sol` and using it to create our token!


- `constructor() ERC721("Bored Pets", "BP")`

The constructor is called when we deploy the smart contract. In this case, `constructor()` takes two arguemnts. You can see that we are passing the `name` of our token and the `symbol` as well.

- `function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }`

This funtion is super straightforward! It can only be called by the owner (the person who deployed the contract). It takes two arguments, the first is the `address` you want to mint the tokens to and the second is the `amount` of tokens you want to mint. And that's it! Pretty cool huh?

## Write the deployment script

In order to deploy the smart contract, we'll need to write our migrations file. Create the file `1_deploy_contracts.js` under `packages/truffle/migrations`. Then, copy and paste the code below:

```javascript
const BoredPetsNFT = artifacts.require("BoredPetsERC20");

module.exports = function (deployer) {
  deployer.deploy(BoredPets);
};
```
`artifacts.require` is how we tell Truffle which contracts we'd like to interact with and returns a contract abstraction that we can use in the rest of our deployment script. NOTE: The name should match the contract name (`BoredPets`) and NOT the filename (`BoredPetsERC20.sol`).

## Deploy the NFT smart contract

This tutorial outlines how to deploy with Infura, but Truffle has great features to speed up local testing:

1. Use Dashboards so you don't have to expose your private key
2. Use Ganache forking to test using real data and interact with live contracts locally

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
MNEMONIC="<YOUR MNEMONIC HERE>"
INFURA_KEY="<Your Infura Project ID>"
RINKEBY_MNEMONIC="<Your Rinkeby Mnemonic>"
MAINNET_MNEMONIC="<Your Mainnet Mnemonic>"
```

## Test the smart contract

...

## Community and Support

Loved this tutorial and want to share with the Truffle community? Join our Discord and Reddit communities. Also, follow our Twitter [@trufflesuite](https://twitter.com/trufflesuite) or join our monthly community calls to stay up-to-date with the latest on all things Truffle.

- [Discord](https://discord.com/invite/vbx6jy6XC8)
- [Reddit](https://www.reddit.com/r/Truffle/)

If you need help, find us on Github discussions!
- [Truffle Support](https://github.com/orgs/trufflesuite/discussions)
- [Ganache Support](https://github.com/orgs/trufflesuite/discussions/5121)

Lastly, if you think you've discovered a bug, please let us know by creating an issue on the relevant repo or fixing it yourself - Truffle is open source :)
- [Truffle Github Org](https://github.com/trufflesuite)

## License

[MIT](./LICENSE)
