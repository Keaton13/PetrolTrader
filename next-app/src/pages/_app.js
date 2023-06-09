import "../styles/globals.css";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { localhost, goerli } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";

// Importing Providers from Wagmi
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { AppProvider } from "../context/context";

// Configure chains and providers
const { chains, provider } = configureChains(
  [goerli, localhost],
  [
    infuraProvider({ priority: 1, apiKey: process.env.INFURA_API_KEY }),
    jsonRpcProvider({
      priority: 2,
      rpc: (chain) => ({
        http: "HTTP://127.0.0.1:7545",
      }),
    }),
  ]
);

// Get default wallets and connectors
const { connectors } = getDefaultWallets({
  appName: "PetrolTrader",
  chains,
});

// Create a WAGMI client with autoConnect enabled
const wagmiConfig = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()} coolMode>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
