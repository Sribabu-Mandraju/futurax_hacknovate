import { useActiveAccount } from "@thirdweb-dev/react";
import { useEffect } from "react";

const WalletAddress = () => {
  const account = useActiveAccount();

  useEffect(() => {
    console.log("Active Account:", account);
  }, [account]);

  return (
    <div>
      {account ? (
        <p>Connected Wallet: {account.address}</p>
      ) : (
        <p>No Wallet Connected</p>
      )}
    </div>
  );
};

export default WalletAddress;
