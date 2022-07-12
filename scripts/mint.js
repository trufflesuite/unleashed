const BoredPetsNFT = artifacts.require("BoredPetsNFT")

const main = async (cb) => {
    try {
      const boredPetsNFT = await BoredPetsNFT.deployed()
      let txn = await boredPetsNFT.mint("TOKEN_URI");
      console.log(txn);
    } catch(err) {
      console.log('Doh! ', err);
    }
    cb();
  }
  
module.exports = main;