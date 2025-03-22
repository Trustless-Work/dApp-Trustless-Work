"use client";

import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import useCountdown from "../hooks/useCountdown";

const CountdownTimer = () => {
  const remainingTime = useCountdown(2, 30, 0);

  return (
    <Card className="p-6 mt-8 w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-4 justify-center">
        <Clock className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Estimated Time</h3>
      </div>
      <div className="grid grid-cols-3 gap-6 text-center">
        {["Hours", "Minutes", "Seconds"].map((label, index) => {
          const timeValue = [
            remainingTime.hours,
            remainingTime.minutes,
            remainingTime.seconds,
          ][index];
          return (
            <div key={label} className="bg-muted p-5 rounded-md w-full">
              <div className="text-4xl font-bold">
                {timeValue.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-muted-foreground">
                {label.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CountdownTimer;
