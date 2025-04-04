import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "../../../hooks/client";

const ConnectWallet = () => {
  return (
    <div>
      <ConnectButton
        client={client}
        render={({ connect, address }) =>
          address ? (
            <button className="bg-green-600 text-white py-2 px-4 rounded-lg">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </button>
          ) : (
            <button
              onClick={connect}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Connect Wallet
            </button>
          )
        }
      />
    </div>
  );
};

export default ConnectWallet;
