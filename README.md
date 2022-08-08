# Unleash a NFT 🐰 🐶 🐱 🐭 🐹

In this tutorial, we will be creating a Bored Pets NFT smart contract for our Petaverse! The technologies we will be using are:

- Truffle
- Infura
- Metamask
- Web3.js

## Setup

First, we'll want to build our Petaverse by cloning the unleashed repository's [main branch](https://github.com/trufflesuite/unleashed/tree/main). We recommend cloning it into a folder called `bored-pets-nft`. Follow the setup instructions [here]()

You should have:
1. The `unleashed` repository cloned
2. Truffle installed
3. Ganache installed
4. An Infura account
5. A MetaMask wallet

<TODO: Put in set up instructions on base repo>

Once you've gotten these installation requirements down, we can start building the NFT smart contract!

## Core Concepts

- A **NFT** (non-fungible token) is digital data that is stored on chain. Unlike cryptocurrencies, which are *fungible* (aka your Bitcoin is the same as my Bitcoin), NFTs are one-of-a-kind.
- **ERC-721** defines the set of standards that make a token non-fungible. You can read more about it on Ethereum's website [here](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/).
- Every NFT will have a combination of a **`uint256 tokenId`** variable and contract address that must be globally unique.
- All the fun stuff about NFTs - the rarity, description, image, etc - is part of its **metadata**. In this tutorial, the NFT's **`string tokenURI`** will point to where the metadata is stored on [IPFS](https://ipfs.io/).
- **ERC-4907**
- The ERC-4907 is an extenstion of the ERC-721 token standard. `ERC4907 proposes an additional role called (user) which can be granted to addresses, and a time where the role is automatically revoked. The user role represents permission to 'use' the NFT, but not the ability to transfer it or set users.
From the official EIP-4907 doc - (https://eips.ethereum.org/EIPS/eip-4907).` 
Basically it will allow you to add this functionality to any new or pre-existing ERC-721 (using a proxy) contract to allow your NFT's to be rented out to other users. It does this by adding a new "role" to the NFT called the rentee.

Find out more about it [here](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4907.md).



## Create the NFT smart contract

Creating a NFT smart contract is short and sweet! [OpenZeppelin](https://www.openzeppelin.com/contracts) contracts make it super easy. First, we'll want change into our `packages/truffle` directory and add the OpenZeppelin dependency:

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

To be a valid NFT, `BoredPetsNFT` implements the ERC-721 standard by inheriting the implementation of `ERC721URIStorage.sol`

- `@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol`

`ERC721URIStorage.sol` is an extension of `ERC721.sol`, which stores the `tokenURI` in `storage` (aka on-chain). If we did not use this extension, the `tokenURI` is derived by concatenating a `baseURI` and `tokenId`. However, we want to store the metadata on IPFS, which identifies content via a hash. Therefore, we cannot generate the `tokenURI` by using the `tokenId`. Instead, we must store the `tokenURI` on-chain to get that data.

To use this, we simply need to code `BoredPetsNFT is ERC721URISTorage`.

- `@openzeppelin/contracts/utils/Counters.sol`

In order to guarantee each `tokenId` is unique, we will increment it by one each time a NFT is minted. We use `Counters.Counter private _tokenIds` to increment and track the value of `tokenId`.

Now, let's go over the methods:

- `constructor() ERC721("Bored Pets Yacht Club", "BPYC")`

The constructor is called when we deploy the smart contract. In this case, `constructor()` indicates our our NFT contract does not take in any parameters. Then, we set "Bored Pets Yacht Club" as the name and "BPYC" as the symbol for our NFTs.

- `function mint(string memory _tokenURI) public`

This funtion is super straightforward! Every time we mint an NFT, we want to guarantee `tokenId` is unique by incrementing the counter by one. Then, we just call `_safeMint` to mint and store the `_tokenURI`!


## Adding the ERC-4907 Capabilities 

**Note all of the contracts that you need to complete this tutorial will be located in the `contracts` directory however we recommend for you to write the contracts yourself as it makes it easier to learn.

You'll want to add this interface from the OpenZeppelin contracts for the ERC4907.

Create a file called IERC4907.sol  in your `contracts` directory and add the code below.

```javascript
 // SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;
interface IERC4907 {

    // Logged when the user of a token assigns a new user or updates expires
    /// @notice Emitted when the `user` of an NFT or the `expires` of the `user` is changed
    /// The zero address for user indicates that there is no user address

    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);
    /// @notice set the user and expires of a NFT
    /// @dev The zero address indicates there is no user 
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires

    function setUser(uint256 tokenId, address user, uint64 expires) external ;

    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId) external view returns(address);

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user 
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT

    function userExpires(uint256 tokenId) external view returns(uint256);
    } 
```
Once you've created this file you shouldn't need to touch it again. We will use this to extend our ERC721 contract that we created above.

Next lets create our `ERC4907.sol` file.

Add the code below to your file and we'll step through each function to explain what its doing.

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC4907.sol";

contract ERC4907 is ERC721, IERC4907 {
    struct UserInfo {
        address user; // address of user role
        uint64 expires; // unix timestamp, user expires
    }

    mapping(uint256 => UserInfo) internal _users;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {}

    /// @notice set the user and expires of a NFT
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public virtual override {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        UserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;
        emit UpdateUser(tokenId, user, expires);
    }

    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        } else {
            return address(0);
        }
    }

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _users[tokenId].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC4907).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != to && _users[tokenId].user != address(0)) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        }
    }
}
```

First we are importing the necessary files to allow this contract to work. As you can see we are importing `"@openzeppelin/contracts/token/ERC721/ERC721.sol"` and `"./IERC4907.sol"`. 

We'll be inherting these in our contracts in order to utlize some of there functionality.

### setUser

This function can only be called by the `"owner"` of the NFT. It allows the owner to specify who will be the rentee of the NFT. The user now has the NFT in their wallet but cannot perform any actions on it such as burn or transfer.


```javascript 
/// @notice set the user and expires of a NFT
/// @dev The zero address indicates there is no user
/// Throws if `tokenId` is not valid NFT
/// @param user The new user of the NFT
/// @param expires UNIX timestamp, The new user could use the NFT before expires
function setUser(uint256 tokenId, address user, uint64 expires) public virtual{
    require(_isApprovedOrOwner(msg.sender, tokenId),"ERC721: transfer caller is not owner nor approved");
    UserInfo storage info =  _users[tokenId];
    info.user = user;
    info.expires = expires;
    emit UpdateUser(tokenId,user,expires);
}
```

This function will update the `UserInfo` struct with the `address` of the rentee and the block timestamp that the renting period will `expires`.

## userOf

The user of function will allow us to see if a NFT is still being rented by a user and if not it will return `0`.


```javascript
    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        } else {
            return address(0);
        }
    }
```

This function takes the `tokenId` as an argument and will return the user `address` if that token is still being rented.


   
## Write the deployment script

In order to deploy the smart contract, we'll need to write our migrations file. Create the file `1_deploy_contracts.js` under `packages/truffle/migrations`. Then, copy and paste the code below:

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
2. Use Ganache forking to test using real data and interact with live contracts locally


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
