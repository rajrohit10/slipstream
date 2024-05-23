const hre = require("hardhat");




async function main() {


   const CLPool = await hre.ethers.getContractFactory("CLPool");
   const cLPool = await CLPool.deploy();

   await cLPool.deployed();

   console.log(`cLPool deployed to ${cLPool.address}`);


   const CLFactory = await hre.ethers.getContractFactory("CLFactory");
   const cLFactory = await CLFactory.deploy("0xE129236aAf50E8890a3eaad082FF37232bAB37b2",cLPool.address);

   await cLFactory.deployed();

   console.log(`cLFactory deployed to ${cLFactory.address}`);

   const CLGauge = await hre.ethers.getContractFactory("CLGauge");
   const cLGauge = await CLGauge.deploy();

   await cLGauge.deployed();

   console.log(`cLGauge deployed to ${cLGauge.address}`);


   const CLGaugeFactory = await hre.ethers.getContractFactory("CLGaugeFactory");
   const cLGaugeFactory = await CLGaugeFactory.deploy("0xE129236aAf50E8890a3eaad082FF37232bAB37b2",cLGauge.address);

   await cLGaugeFactory.deployed();

   console.log(`cLGaugeFactory deployed to ${cLGaugeFactory.address}`);
   

   const NFTDescriptor = await hre.ethers.getContractFactory("NFTDescriptor");
   const nFTDescriptor = await NFTDescriptor.deploy();

   await nFTDescriptor.deployed();

   console.log(`nFTDescriptor deployed to ${nFTDescriptor.address}`);


   const NonfungibleTokenPositionDescriptor = await hre.ethers.getContractFactory("NonfungibleTokenPositionDescriptor");
   const nonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deploy("0xE129236aAf50E8890a3eaad082FF37232bAB37b2","0x4554480000000000000000000000000000000000000000000000000000000000");

   await nonfungibleTokenPositionDescriptor.deployed();

   console.log(`NonfungibleTokenPositionDescriptor deployed to ${nonfungibleTokenPositionDescriptor.address}`);
   

   const NonfungiblePositionManager = await hre.ethers.getContractFactory("NonfungiblePositionManager");
   const nonfungiblePositionManager = await NonfungiblePositionManager.deploy(cLFactory.address,"0xE129236aAf50E8890a3eaad082FF37232bAB37b2",nonfungibleTokenPositionDescriptor.address);

   await nonfungiblePositionManager.deployed();

   console.log(`NonfungiblePositionManager deployed to ${nonfungiblePositionManager.address}`);

   await cLGaugeFactory.setNonfungiblePositionManager(nonfungiblePositionManager.address);

   

   const CustomSwapFeeModule = await hre.ethers.getContractFactory("CustomSwapFeeModule");
   const customSwapFeeModule = await CustomSwapFeeModule.deploy(cLFactory.address);

   await customSwapFeeModule.deployed();

   console.log(`CustomSwapFeeModule deployed to ${customSwapFeeModule.address}`);
   

   const CustomUnstakedFeeModule = await hre.ethers.getContractFactory("CustomUnstakedFeeModule");
   const customUnstakedFeeModule = await CustomUnstakedFeeModule.deploy(cLFactory.address);

   await customUnstakedFeeModule.deployed();

   console.log(`CustomUnstakedFeeModule deployed to ${customUnstakedFeeModule.address}`);
   //Function Calls
   await nonfungiblePositionManager.setOwner("0xE129236aAf50E8890a3eaad082FF37232bAB37b2")
   await cLFactory.setOwner("0xE129236aAf50E8890a3eaad082FF37232bAB37b2")
   await cLFactory.setSwapFeeManager("0xE129236aAf50E8890a3eaad082FF37232bAB37b2")
   await cLFactory.setUnstakedFeeManager("0xE129236aAf50E8890a3eaad082FF37232bAB37b2")

   //End
   

   const MixedRouteQuoterV1 = await hre.ethers.getContractFactory("MixedRouteQuoterV1");
   const mixedRouteQuoterV1 = await MixedRouteQuoterV1.deploy(cLFactory.address,"0xE129236aAf50E8890a3eaad082FF37232bAB37b2","0xE129236aAf50E8890a3eaag082FF37232bAB37b2");

   await mixedRouteQuoterV1.deployed();

   console.log(`MixedRouteQuoterV1 deployed to ${mixedRouteQuoterV1.address}`);
   

   const QuoterV2 = await hre.ethers.getContractFactory("QuoterV2");
   const quoterV2 = await QuoterV2.deploy("0xE129236aBf50E8890a3eaad082FF37232bAB37b2","0xE129236aAf50E8890a3eaad082FF37232bAB37b2");

   await quoterV2.deployed();

   console.log(`QuoterV2 deployed to ${quoterV2.address}`);






}

main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
});