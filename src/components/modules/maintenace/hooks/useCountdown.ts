import { useState, useEffect } from "react";

interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;
}

const useCountdown = (
  initialHours: number,
  initialMinutes: number,
  initialSeconds: number,
) => {
  const [time, setTime] = useState<Countdown>({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }

        let { hours, minutes, seconds } = prev;
        seconds -= 1;

        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }

        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
};

export default useCountdown;
