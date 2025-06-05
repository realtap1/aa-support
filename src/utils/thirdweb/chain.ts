import { defineChain } from "thirdweb";

export const chain = defineChain({
    id: 200820172034,
    rpc: "https://testnetrpc.ogpuscan.io",
    nativeCurrency: {
      name: "OpenGPU Testnet",
      symbol: "ToGPU",
      decimals: 18,
    },
},
);
