import { useState } from "react";

export function useHoverTracker() {
  const [hoverCount, setHoverCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [maxHoverTime, setMaxHoverTime] = useState(0);

  const onMouseEnter = () => {
    setHoverCount((c) => c + 1);
    setStartTime(Date.now());
  };

  const onMouseLeave = () => {
    if (startTime) {
      const duration = Date.now() - startTime;
      setTotalTime((t) => t + duration);
      setMaxHoverTime((m) => Math.max(m, duration));
      setStartTime(null);
    }
  };

  return {
    hoverCount,
    totalTime,
    maxHoverTime,
    onMouseEnter,
    onMouseLeave,
  };
}
