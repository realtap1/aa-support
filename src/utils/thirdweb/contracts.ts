import { getContract } from "thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { tokenABI } from "./tokenABI";
import { userABI } from "./ABI/userABI";
import { postRegistryABI } from "./ABI/postRegistryABI";
import { tippingABI } from "./ABI/tippingABI";
import { socialGraphABI } from "./ABI/socialGraphABI";
import { tokenFactoryABI } from "./ABI/tokenFactoryABI";


export const tokenContractAddress = "0xC5cEca3259Ec23bF636Cd47A4660731a6c534CCA";




export const userContractAddress = "0x71AAB938F0BD52A7BD1FC802F17c7066214a59e7";

export const postRegistryContractAddress = "0x3137558F275c8Bfe1Abfa9aeA67731bC4c87A7eC";

export const tippingContractAddress = "0x15685e8a4acDB684eAA276fFc6A097D9aEF3D0e9";

export const socialGraphContractAddress = "0x68CEe52A2926a49137B21e4c8F32Ada310BC6377";

export const tokenFactoryContractAddress = "0x53De9029c9ee0ae11Ec3f7Bd781cd53bDE70E599";


export const userContract = getContract({
    client: client,
    chain: chain,
    address: userContractAddress,
    abi: userABI,
});

export const postRegistryContract = getContract({
    client: client,
    chain: chain,
    address: postRegistryContractAddress,
    abi: postRegistryABI,
});


export const tippingContract = getContract({
    client: client,
    chain: chain,
    address: tippingContractAddress,
    abi: tippingABI,
});

export const socialGraphContract = getContract({
    client: client,
    chain: chain,
    address: socialGraphContractAddress,
    abi: socialGraphABI,
});


export const tokenContract = getContract({
    client: client,
    chain: chain,
    address: tokenContractAddress,
    abi: tokenABI,
});

export const tokenFactoryContract = getContract({
    client: client,
    chain: chain,
    address: tokenFactoryContractAddress,
    abi: tokenFactoryABI,
});



