const { getSelectors, FacetCutAction } = require("./lib/diamond.js");

async function deployDiamond() {
  const accounts = await ethers.getSigners(); // Get Signer Accounts
  const contractOwner = accounts[0]; // Set Account[0] to Contract Owner

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet"); // Deploy the DiamondCutFacet Contract
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();
  console.log("DiamondCutFacet deployed:", diamondCutFacet.address); // Address of DiamondCutFacet

  // deploy Diamond
  const Diamond = await ethers.getContractFactory("Diamond"); // Deploy the Daimond Contract
  const diamond = await Diamond.deploy(
    contractOwner.address,
    diamondCutFacet.address
  ); // Constructor need two params 1.Contract Owner address , 2. DiamondCutFacet Address
  await diamond.deployed();
  console.log("Diamond deployed:", diamond.address);

  // deploy DiamondInit
  const DiamondInit = await ethers.getContractFactory("DiamondInit"); // Initialize Diamond Contract State Using The init Method
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  console.log("DiamondInit deployed:", diamondInit.address);

  // deploy facets
  console.log("");
  console.log("Deploying facets");
  const FacetNames = [
    "DiamondLoupeFacet",
    "OwnershipFacet",
    "ERC20Facet",
    "MintFacet",
  ];
  const cut = [];
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    console.log(`${FacetName} deployed: ${diamondInit.address}`);
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }

  // upgrade diamond with facets
  console.log("");
  console.log("Diamond Cut:", cut);
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamond.address); // Get Instance of DiamondCut
  let tx;
  let receipt;
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData("init"); // Get Init Function Selector 0xe1c7392a
  tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall); // Call Diamond Cut Method with Facets Struct Init Address and Function Call
  console.log("Diamond cut tx: ", tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  console.log("Completed diamond cut");
  return diamond.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.deployDiamond = deployDiamond;
