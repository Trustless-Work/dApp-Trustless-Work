import { useState, useEffect } from "react";

interface Countdown {
  hours: number;
  minutes: number;
}

const useCountdown = (initialHours: number, initialMinutes: number) => {
  const [time, setTime] = useState<Countdown>({
    hours: initialHours,
    minutes: initialMinutes,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.hours === 0 && prev.minutes === 0) {
          clearInterval(timer);
          return prev;
        }

        let { hours, minutes } = prev;
        minutes -= 1;

        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }

        return { hours, minutes };
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return time;
};

export default useCountdown;
