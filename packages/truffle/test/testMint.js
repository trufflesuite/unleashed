const { constants } = require("@openzeppelin/test-helpers");
const BoredPetsNFT = artifacts.require("BoredPetsNFT");

function assertEventValues(eventValues, expectedAccount, expectedTokenId) {
  assert.equal(eventValues.from, constants.ZERO_ADDRESS, "From is not zero address");
  assert.equal(eventValues.to, expectedAccount, "To is not first account");
  assert.equal(eventValues.tokenId, expectedTokenId, "TokenId was not incremented");
}

contract("BoredPetsNFT", (accounts) => {
  it("should increment the tokenId after minting twice", async () => {
    const boredPetsNFT = await BoredPetsNFT.deployed();
    await boredPetsNFT.mint("TOKEN_URI1");
    await boredPetsNFT.mint("TOKEN_URI2");
    let events = await boredPetsNFT.getPastEvents("Transfer", {fromBlock: 0});
    assertEventValues(events[0].returnValues, accounts[0], 1);
    assertEventValues(events[1].returnValues, accounts[0], 2);
  });
});