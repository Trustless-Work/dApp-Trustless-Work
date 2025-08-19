import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useShouldReduceMotion } from "@/hooks/useMobile";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false,
  sizes = "100vw",
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const shouldReduceMotion = useShouldReduceMotion();

  useEffect(() => {
    if (priority || !shouldReduceMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      },
    );

    const img = document.createElement("img");
    observer.observe(img);

    return () => observer.disconnect();
  }, [priority, shouldReduceMotion]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
        />
      )}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};
