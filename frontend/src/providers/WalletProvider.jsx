import { createContext, useContext, useState, useEffect } from "react";
import { useAddress, useDisconnect, useConnect } from "@thirdweb-dev/react";
import { metamaskWallet, walletConnect, coinbaseWallet } from "@thirdweb-dev/react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectWithMetamask = useConnect(metamaskWallet());
  const connectWithWalletConnect = useConnect(walletConnect());
  const connectWithCoinbase = useConnect(coinbaseWallet());

  return (
    <WalletContext.Provider
      value={{
        address,
        connectWithMetamask,
        connectWithWalletConnect,
        connectWithCoinbase,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
