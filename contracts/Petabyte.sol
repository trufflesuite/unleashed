// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Petabyte {
  string public pet;
  function set(string memory _pet) public {
    pet = _pet;
  }

  function get() view public returns (string memory) {
    return pet;
  }

  constructor() {
    pet = "fluffy";
  }
}
