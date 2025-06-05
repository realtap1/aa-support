export const tokenFactoryABI = [
  {
    type: "constructor",
    inputs: [{ name: "_feeWallet", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createToken",
    inputs: [
      { name: "name_", type: "string", internalType: "string" },
      { name: "symbol_", type: "string", internalType: "string" },
      { name: "logoURI_", type: "string", internalType: "string" },
      { name: "description_", type: "string", internalType: "string" },
      { name: "totalSupply_", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "creationFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "feeWallet",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateFeeWallet",
    inputs: [{ name: "newWallet", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "TokenCreated",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
] as const;
