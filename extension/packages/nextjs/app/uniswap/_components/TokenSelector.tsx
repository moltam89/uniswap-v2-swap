interface TokenSelectorProps {
  tokenAddress: string;
  setTokenAddress: (address: string) => void;
  tokenAddresses: { [address: string]: { name: string; decimals: number } };
}

export const TokenSelector = ({ tokenAddress, setTokenAddress, tokenAddresses }: TokenSelectorProps) => {
  return (
    <select
      className="select select-accent w-40 max-w-xs text-center"
      onChange={event => setTokenAddress(event.target.value)}
      value={tokenAddress}
    >
      {Object.entries(tokenAddresses).map(([address, { name }]) => (
        <option key={address} value={address}>
          {name}
        </option>
      ))}
    </select>
  );
};
