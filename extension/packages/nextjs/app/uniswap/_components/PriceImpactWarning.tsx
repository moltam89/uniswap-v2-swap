interface PriceImpactWarningProps {
  priceImpact: number | undefined;
}

export const PriceImpactWarning = ({ priceImpact }: PriceImpactWarningProps) => {
  if (!priceImpact || priceImpact < 0.5) {
    return <div></div>;
  }

  return (
    <div
      className="font-bold text-error tooltip tooltip-info tooltip-top"
      data-tip="V2 liquidity is low for this trade"
    >
      High Price Impact: {priceImpact}%
    </div>
  );
};
