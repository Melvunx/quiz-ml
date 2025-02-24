import { useEffect, useState } from "react";

export default function useCounterAnimation(
  finalNumber: number,
  duration: number
) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = 18;
    const step = Math.ceil((finalNumber * interval) / duration);

    let currentCounter = 0;

    const timer = setInterval(() => {
      currentCounter += step;

      if (currentCounter >= finalNumber) {
        setCounter(finalNumber);
        clearInterval(timer);
        return;
      }

      setCounter(currentCounter);
    }, interval);
  }, [duration, finalNumber]);

  return counter;
}
