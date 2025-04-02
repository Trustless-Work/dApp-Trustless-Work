/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
interface Countdown {
  hours: number;
  minutes: number;
}

const useCountdown = (initialHours: number, initialMinutes: number) => {
  const hours =
    initialHours ||
    parseInt(process.env.NEXT_PUBLIC_COUNTDOWN_HOURS || "2", 10);
  const minutes =
    initialMinutes ||
    parseInt(process.env.NEXT_PUBLIC_COUNTDOWN_MINUTES || "30", 10);

  const [time, setTime] = useState<Countdown>({
    hours,
    minutes,
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
