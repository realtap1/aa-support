[
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "bio",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "avatarUrl",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "encryptionPublicKey",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            }
        ],
        "name": "ProfileSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "ProfileDeleted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "deleteProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getProfile",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "bio",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "avatarUrl",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptionPublicKey",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct User.Profile",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllProfiles",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "bio",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "avatarUrl",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptionPublicKey",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct User.Profile[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllUsernames",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "profileExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_bio",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_avatarUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_encryptionPublicKey",
                "type": "string"
            }
        ],
        "name": "setProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
