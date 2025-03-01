import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type LoadingStringProps = {
  word?: string;
  delay?: number;
  className?: string;
};

const LoadingString: React.FC<LoadingStringProps> = ({
  word = "Loading",
  delay = 500,
  className,
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return "";
        return prevDots + ".";
      });
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div
      className={cn(
        "flex items-center justify-center font-regular-noto",
        className
      )}
    >
      {word}
      {dots}
    </div>
  );
};

export default LoadingString;
