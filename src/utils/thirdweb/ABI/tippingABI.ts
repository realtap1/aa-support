export const tippingABI = [
    {
      "type": "function",
      "name": "OECHOToken",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "address", "internalType": "contract IERC20" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "deployer",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "initialize",
      "inputs": [
        {
          "name": "_OECHOTokenAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "setOECHOToken",
      "inputs": [
        {
          "name": "_OECHOTokenAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "tipNative",
      "inputs": [
        { "name": "_to", "type": "address", "internalType": "address payable" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "tipOECHO",
      "inputs": [
        { "name": "_to", "type": "address", "internalType": "address" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "upgradeTo",
      "inputs": [
        {
          "name": "newImplementation",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "inputs": [
        {
          "name": "newImplementation",
          "type": "address",
          "internalType": "address"
        },
        { "name": "data", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "event",
      "name": "AdminChanged",
      "inputs": [
        {
          "name": "previousAdmin",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "newAdmin",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BeaconUpgraded",
      "inputs": [
        {
          "name": "beacon",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Initialized",
      "inputs": [
        {
          "name": "version",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Tipped",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "tokenType",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Upgraded",
      "inputs": [
        {
          "name": "implementation",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    }
  ] as const;