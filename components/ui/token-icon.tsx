import Image from "next/image";

type TokenIconProps = {
  symbol: string;
  size?: number;
  className?: string;
};

const tokenImageMap: Record<string, string> = {
  ETH: "/eth.svg",
  DOT: "/dot.svg",
  vETH: "/veth.svg",
  vDOT: "/vdot.svg",
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
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full"
      />
    </div>
  );
}
