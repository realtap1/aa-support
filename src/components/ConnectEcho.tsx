import { client } from "@/utils/thirdweb/client";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { smartWallet, inAppWallet } from "thirdweb/wallets";
import { chain } from "@/utils/thirdweb/chain";
import { ethers } from "ethers";


const wallet = smartWallet({
  chain: chain,
  factoryAddress: "0xb7D603FbAa86764347ad1AF00Be2dA1ab78fBEd2",
  sponsorGas: true,
  overrides: {
    entrypointAddress: "0x0cfF5a2547de08Ca992c0DF45Df3f5403d9D2003",
    bundlerUrl: "https://bundler.oecho.cloud",
    paymaster: async () => {
      return {
        paymasterAndData: ethers.utils.hexZeroPad("0x5B1AEeF2684C2f22F00bc081a7492E013B69C5fA", 32),
        version: "v0.7"
      };
    },
  },
});

const personalWallet = inAppWallet({
  auth: {
    options: ["google", "discord", "telegram", "x", "passkey"],
  },
  
});

const wallets = [personalWallet, wallet];

export default function ConnectEcho() {
  return (
    <ConnectButton
      client={client}
      chain={chain}
      wallets={wallets}
      accountAbstraction={{
        chain: chain,
        sponsorGas: true,
        factoryAddress: "0xb7D603FbAa86764347ad1AF00Be2dA1ab78fBEd2",
      }}
      theme={darkTheme({
        colors: {
          modalBg: "hsl(210, 20%, 10%)",
          accentText: "hsl(210, 100%, 50%)",
          borderColor: "hsl(210, 20%, 30%)",
          primaryButtonBg: "rgb(17, 24, 39)",
          primaryButtonText: "rgb(255, 255, 255)",
          secondaryButtonBg: "hsl(210, 80%, 40%)",
          primaryText: "hsl(210, 20%, 90%)",
          skeletonBg: "hsl(210, 20%, 15%)",
          selectedTextBg: "hsl(210, 20%, 90%)",
          tertiaryBg: "hsl(210, 20%, 20%)",
        },
      })}
      connectButton={{
        label: "Connect",
        style: {
          borderRadius: "9999px",
          padding: "0.75rem 2rem",
          fontWeight: "500",
          border: "1px solid rgb(55, 65, 81)",
          transition: "all 0.2s ease-in-out",
        },
      }}
      connectModal={{ size: "compact" }}
    />
  );
}
