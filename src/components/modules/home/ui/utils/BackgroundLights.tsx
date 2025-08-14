"use client";

import { useShouldReduceMotion } from "@/hooks/mobile.hook";

export const BackgroundLights = () => {
  const shouldReduceMotion = useShouldReduceMotion();

  // Si es mobile o dispositivo de gama baja, no renderizar animaciones
  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-400/10 dark:bg-purple-500/10 blur-[80px]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[100px]" />
      <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-400/10 dark:bg-purple-500/10 blur-[80px]" />
    </div>
  );
};
