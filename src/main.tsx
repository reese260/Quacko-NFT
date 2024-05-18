import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"
import { createWeb3Modal } from "@web3modal/wagmi/react";

import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, baseSepolia, base } from "viem/chains";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) throw new Error("Project ID is undefined");

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Define chains
const chains = [base] as const

const themeVariables = {
  '--w3m-accent': '#87CEEB'
}

const wagmiConfig = createConfig({
  chains, // Use the defined chains here
  transports: {
    [base.id]: http()
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ],
});

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, themeVariables });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
