import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

/**
 * @description This configuration is used to set up the Wagmi client with the necessary
 * chains and connectors for the application.
 */
export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Crypto Asset Tracker",
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
