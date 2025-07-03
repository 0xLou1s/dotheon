import Image from "next/image";

type TokenIconProps = {
  symbol: string;
  size?: number;
  className?: string;
};

const tokenImageMap: Record<string, string> = {
  ETH: "/coins/eth.svg",
  DOT: "/coins/dot.svg",
  vETH: "/coins/eth.svg",
  vDOT: "/coins/vdot.svg",
};

export function TokenIcon({
  symbol,
  size = 48,
  className = "",
}: TokenIconProps) {
  const src = tokenImageMap[symbol] || "/unknown-token.svg";
  const alt = `${symbol} Icon`;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} width={size} height={size} />
    </div>
  );
}
