var ERC4907Demo = artifacts.require("./ERC4907Demo.sol");

function getErrorMessage(error) {
  if (error instanceof Error) return error.message
  return String(error)
}

const main = async (cb) => {
  try {
    let accounts = await web3.eth.getAccounts()
    const args = process.argv.slice(4);
    const contract = await ERC4907Demo.deployed();
    const carlos = accounts[0];
    const maria = accounts[1];
    let expires = Math.floor(new Date().getTime()/1000) + 1000;
    await contract.mint(1, carlos);
    await contract.setUser(1, maria, expires);

    const rentee = await contract.userOf(1);
    const renter = await contract.ownerOf(1);

    console.log("renter:", renter);
    console.log("rentee:", rentee);
  } catch(err) {
    console.log('Uh oh! ', getErrorMessage(err));
  }
  cb();
}

module.exports = main;