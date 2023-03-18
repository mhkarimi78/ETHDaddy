const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};
describe("ETHDaddy", () => {
  let ethDaddy, deployer, owner1;
  const NAME = "ETHDaddy";
  const SYMBOL = "ETHD";
  beforeEach(async () => {
    // addresses from hardhat
    [deployer, owner1] = await ethers.getSigners();
    const ETHDaddy = await ethers.getContractFactory(NAME);
    ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL);
    // list a domain
    const transaction = await ethDaddy
      .connect(deployer)
      .list("jack.eth", tokens(10));
    await transaction.wait();
  });
  describe("Deployment", () => {
    it("has a name", async () => {
      const result = await ethDaddy.name();
      expect(result).to.equal(NAME);
    });
    it("has a symbol", async () => {
      const result = await ethDaddy.symbol();
      expect(result).to.equal(SYMBOL);
    });
    it("sets the owner", async () => {
      const result = await ethDaddy.owner();
      expect(result).to.equal(deployer.address);
    });
    it("returns the max supply", async () => {
      const result = await ethDaddy.maxSupply();
      expect(result).to.equal(1);
    });
  });
  describe("Domain", () => {
    it("Returns domain attributes", async () => {
      let domain = await ethDaddy.getDomain(1);
      expect(domain.name).to.be.equal("jack.eth");
      expect(domain.cost).to.be.equal(tokens(10));
      expect(domain.isOwned).to.be.equal(false);
    });
  });
  describe("Minting", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");
    beforeEach(async () => {
      const transaction = await ethDaddy.connect(owner1).mint(ID);
      await transaction.wait();
    });
    it("Updates the owner", async () => {
      const owner = await ethDaddy.ownerOf(ID);
      expect(owner).to.be.equal(owner1.address);
    });
  });
});
