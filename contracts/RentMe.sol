pragma solidity ^0.8.0;

import "ERC4907.sol";

contract Rentable is ERC4907{
    mapping(uint => string) public tokenURIs;

    constructor(string memory _name, string memory _symbol){
        ERC4907(_name, _symbol)
    }


}