"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WalkthroughIcon,
  WalkthroughStep,
} from "@/constants/walkthrough.constant";
import Image from "next/image";

function isImageIcon(
  icon: WalkthroughIcon,
): icon is Extract<WalkthroughIcon, { kind: "image" }> {
  return (
    typeof icon === "object" &&
    icon !== null &&
    "kind" in icon &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (icon as any).kind === "image" &&
    "src" in icon
  );
}

function renderWalkthroughIcon(icon: WalkthroughIcon): React.ReactNode {
  if (isImageIcon(icon)) {
    return (
      <Image
        width={40}
        height={40}
        src={icon.src}
        alt={icon.alt ?? ""}
        className={cn("object-contain", icon.className)}
      />
    );
  }

  return icon;
}

interface WalkthroughProps {
  steps: WalkthroughStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  className?: string;
}

export function Walkthrough({
  steps,
  onComplete,
  onSkip,
  showSkip = true,
  className,
}: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  return (
    <div className={cn("w-full max-w-2xl mx-auto p-6", className)}>
      <Card className="relative overflow-hidden">
        {/* Skip Button */}
        {showSkip && !isLastStep && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Skip walkthrough</span>
          </Button>
        )}

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="pt-12 pb-8 px-8">
          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                      ? "w-2 bg-primary/60"
                      : "w-2 bg-muted-foreground/20",
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="text-center space-y-6 min-h-[300px] flex flex-col items-center justify-center">
            {/* Icon */}
            {step.icon && (
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  {renderWalkthroughIcon(step.icon)}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-balance">
                {step.title}
              </h2>
              <p className="text-muted-foreground text-lg text-pretty leading-relaxed max-w-lg mx-auto">
                {step.description}
              </p>
            </div>

            {/* Custom Content */}
            {step.content && <div className="w-full mt-6">{step.content}</div>}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground font-mono">
              {currentStep + 1} / {steps.length}
            </span>

            <Button onClick={handleNext} className="gap-2">
              {isLastStep ? (
                <>
                  Complete
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
