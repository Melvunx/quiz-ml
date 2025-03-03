import useCounterAnimation from "@/hooks/use-counterAnimation";
import { FC } from "react";

type CounterAnimationProps = {
  finalNumber: number;
  duration?: number;
};

const CounterAnimation: FC<CounterAnimationProps> = ({
  finalNumber,
  duration = 1650,
}) => {
  const animateNumber = useCounterAnimation(finalNumber, duration);

  return <span>{animateNumber}</span>;
};

export default CounterAnimation;
