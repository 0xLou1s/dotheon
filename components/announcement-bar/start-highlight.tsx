"use client";

import { IconNorthStar } from "@tabler/icons-react";
import { useEffect, useState, useMemo } from "react";

const Star = ({ className }: { className?: string }) => (
  <IconNorthStar size={10} className={className} />
);

export default function StartHighlight() {
  const [isMiddle, setIsMiddle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMiddle((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const stars = useMemo(() => {
    return (
      <div className="hidden items-center lg:flex">
        <Star
          className={isMiddle ? "text-white dark:text-black" : "text-primary"}
        />
        <Star
          className={isMiddle ? "text-primary" : "text-white dark:text-black"}
        />
        <Star
          className={isMiddle ? "text-white dark:text-black" : "text-primary"}
        />
      </div>
    );
  }, [isMiddle]);

  return stars;
}
