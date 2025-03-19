"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useContactBoundedStore } from "../../store/ui";

export interface StepItem {
  title: string;
  description?: string;
  component: React.ReactNode;
}

export interface CreateContactCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: StepItem[];
}

export const CreateContactCard = React.forwardRef<
  HTMLDivElement,
  CreateContactCardProps
>(({ items, className, ...props }, ref) => {
  const currentStep = useContactBoundedStore((state) => state.currentStep);

  const currentComponent = React.useMemo(
    () => items[currentStep - 1]?.component,
    [items, currentStep],
  );

  return (
    <div
      ref={ref}
      className={cn("flex flex-col md:flex-row gap-6", className)}
      {...props}
    >
      <Card className={cn("overflow-hidden md:w-1/3 w-full h-auto")}>
        <CardContent className="p-12 space-y-6">
          <h1 className="text-3xl text-center font-semibold">
            Create a Contact
          </h1>
          <hr className="border-gray-600" />
          <p className="text-lg leading-relaxed">
            <span className="text-blue-500 font-bold">
              Your contacts will be used to
            </span>{" "}
            select
            <br /> them in <br />
            initializing escrows and{" "}
            <span className="font-bold">
              displaying the entities in the escrow details and
              <br /> more.
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className={cn("overflow-hidden md:w-4/6 w-full h-auto")}>
        <CardContent className="p-8 space-y-6">
          <div className="rounded-lg p-8 transition-all duration-200">
            {currentComponent}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CreateContactCard.displayName = "CreateContactCard";
