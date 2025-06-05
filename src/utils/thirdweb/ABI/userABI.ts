export const userABI = [
    {
      "type": "function",
      "name": "createProfile",
      "inputs": [
        { "name": "username", "type": "string", "internalType": "string" },
        { "name": "avatarCID", "type": "string", "internalType": "string" },
        { "name": "bio", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
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
      "name": "getProfile",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "string", "internalType": "string" },
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "initialize",
      "inputs": [],
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
      "name": "updateProfile",
      "inputs": [
        { "name": "username", "type": "string", "internalType": "string" },
        { "name": "avatarCID", "type": "string", "internalType": "string" },
        { "name": "bio", "type": "string", "internalType": "string" }
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
      "name": "ProfileCreated",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "username",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "avatarCID",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "bio",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProfileUpdated",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "username",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "avatarCID",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "bio",
          "type": "string",
          "indexed": false,
          "internalType": "string"
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
