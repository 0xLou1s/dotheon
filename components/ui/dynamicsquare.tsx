import Link from "next/link";
import { Button } from "./button";

export function DynamicSquareBackground({
  title,
  tag,
  description,
  buttonText,
  buttonHref,
}: Readonly<{
  title: string;
  tag?: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}>) {
  return (
    <>
      <style>
        {`
        @keyframes tiles {
          0%, 40%, 80% {
            opacity: 0;
          }
          20%, 60% {
            opacity: 1;
          }
        }
      `}
      </style>
      <div className="relative flex  flex-col gap-8 overflow-hidden rounded-[var(--radius)] border  px-2 py-2 shadow-sm bg-background">
        <DecorativeTilesBackground />
        <div className="z-20">
          <div className="">
            <h3 className="inline text-lg font-bold text-primary">{title}</h3>
            <p className="ml-2 inline  border border-primary px-0.5 align-top text-xs font-medium uppercase tracking-tight bg-primary/10 rounded-[var(--radius)] text-primary">
              {tag}
            </p>
          </div>
          <p className="mt-1 text-sm font-bold">{description}</p>
        </div>
        <Button className="z-20" asChild>
          <Link href={buttonHref} target="_blank">
            {buttonText}
          </Link>
        </Button>
      </div>
    </>
  );
}

const DecorativeTilesBackground = () => {
  const rows = 20;
  const columns = 22;
  const animationDuration = 14; // seconds

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex select-none flex-wrap"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => {
        return (
          <div
            className="flex h-[16px] w-full border-b border-dashed border-primary/10"
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={`line-${rowIndex}`}
          >
            {Array.from({ length: columns }).map((_, colIndex) => {
              const delay = Math.random() * animationDuration;

              return (
                <div
                  className="relative h-[16px] w-[15px] border-r border-dashed border-primary/10"
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={`tile-${colIndex}`}
                >
                  <div
                    className=" inset-0 h-[16px] w-[15px] bg-primary/10"
                    style={{
                      opacity: 0, // Start with opacity 0
                      animationName: "tiles",
                      animationIterationCount: "infinite",
                      animationTimingFunction: "ease",
                      animationDelay: `${delay}s`,
                      animationDuration: `${animationDuration}s`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
