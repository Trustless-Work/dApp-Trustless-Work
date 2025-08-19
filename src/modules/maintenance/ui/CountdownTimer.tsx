"use client";

import { Card } from "@/ui/card";
import { Clock } from "lucide-react";
import useCountdown from "../hooks/useCountdown";

export const CountdownTimer = () => {
  const hours = parseInt(process.env.NEXT_PUBLIC_COUNTDOWN_HOURS || "0", 10);
  const minutes = parseInt(
    process.env.NEXT_PUBLIC_COUNTDOWN_MINUTES || "0",
    10,
  );

  const remainingTime = useCountdown(hours, minutes);

  return (
    <Card className="p-6 mt-8 w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-4 justify-center">
        <Clock className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Estimated Time</h3>
      </div>
      <div className="grid grid-cols-2 gap-6 text-center">
        {["Hours", "Minutes"].map((label, index) => {
          const timeValue = [remainingTime.hours, remainingTime.minutes][index];
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
