import { useAccount, useBalance, useNetwork } from 'wagmi';

export default function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { chain } = useNetwork();
  
  if (!isConnected) {
    return <div>Please connect your wallet first</div>;
  }
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
      <div className="space-y-2">
        <p>
          <span className="text-gray-400">Address:</span>{' '}
          <span className="font-mono">{address}</span>
        </p>
        <p>
          <span className="text-gray-400">Network:</span>{' '}
          <span>{chain?.name || 'Unknown'}</span>
        </p>
        <p>
          <span className="text-gray-400">Balance:</span>{' '}
          <span>{balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}</span>
        </p>
      </div>
    </div>
  );
}