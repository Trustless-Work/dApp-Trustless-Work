"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  CheckSquare,
  DollarSign,
  Layers,
  LockOpenIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { FeatureVideoFallback } from "./FeatureVideoFallback";
import { useMounted } from "@/hooks/useMounted";

type VideoUrl = string | { dark: string; light: string };

interface Feature {
  id: string;
  title: string;
  description: string;
  videoUrl: VideoUrl;
  duration: number;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: "1",
    title: "Deploy an Escrow",
    description:
      "Create and deploy a smart contract escrow on the Stellar blockchain.",
    videoUrl: {
      dark: "/videos/deploy-dark.mp4",
      light: "/videos/deploy-light.mp4",
    },
    duration: 37,
    icon: <Layers className="text-primary" />,
  },
  {
    id: "2",
    title: "Fund Escrow",
    description: "Deposit funds into the escrow to secure the transaction.",
    videoUrl: {
      dark: "/videos/fund-dark.mp4",
      light: "/videos/fund-light.mp4",
    },
    duration: 12,
    icon: <DollarSign className="text-primary" />,
  },
  {
    id: "3",
    title: "Complete Milestone",
    description: "Mark a milestone as completed by the service provider.",
    videoUrl: {
      dark: "/videos/complete-dark.mp4",
      light: "/videos/complete-light.mp4",
    },
    duration: 18,
    icon: <CheckSquare className="text-primary" />,
  },
  {
    id: "4",
    title: "Approve Milestone",
    description: "Review and approve the completed milestone.",
    videoUrl: {
      dark: "/videos/approve-dark.mp4",
      light: "/videos/approve-light.mp4",
    },
    duration: 14,
    icon: <CheckCircle className="text-primary" />,
  },
  {
    id: "5",
    title: "Release Funds",
    description: "Release the escrowed funds to the recipient.",
    videoUrl: {
      dark: "/videos/release-dark.mp4",
      light: "/videos/release-light.mp4",
    },
    duration: 16,
    icon: <LockOpenIcon className="text-primary" />,
  },
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(features[0].id);
  const [progress, setProgress] = useState<Record<string, number>>(() => {
    const initialProgress: Record<string, number> = {};
    features.forEach((feature) => {
      initialProgress[feature.id] = 0;
    });
    return initialProgress;
  });
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  const getVideoUrl = (feature: Feature): string => {
    if (typeof feature.videoUrl === "string") {
      return feature.videoUrl;
    }

    const variant = mounted && resolvedTheme === "dark" ? "dark" : "light";
    return feature.videoUrl[variant];
  };

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);

    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
      }
    });

    setTimeout(() => {
      const selectedVideo = videoRefs.current[value];
      if (selectedVideo && !videoErrors[value]) {
        selectedVideo.muted = true;
        selectedVideo.play().catch((e) => {
          console.error("Error playing video:", e);
          selectedVideo.addEventListener(
            "click",
            () => {
              selectedVideo.play();
            },
            { once: true },
          );
        });
      }
    }, 100);
  }, [videoErrors]);

  const handleVideoEnd = useCallback((currentId: string) => {
    const currentIndex = features.findIndex((f) => f.id === currentId);
    const nextIndex = (currentIndex + 1) % features.length;
    const nextId = features[nextIndex].id;

    setProgress((prev) => ({ ...prev, [currentId]: 100 }));

    setTimeout(() => {
      handleTabChange(nextId);
    }, 500);
  }, [handleTabChange]);

  // Auto-play the first video when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstVideo = videoRefs.current[features[0].id];
      if (firstVideo && !videoErrors[features[0].id]) {
        firstVideo.currentTime = 0;
        firstVideo.muted = true;
        firstVideo.play().catch((e) => {
          console.error("Error playing first video:", e);
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [videoErrors, mounted, resolvedTheme]);

  // Simulate progress when using static fallback
  useEffect(() => {
    const feature = features.find((item) => item.id === activeTab);
    if (!feature || !videoErrors[activeTab]) {
      return;
    }

    setProgress((prev) => ({ ...prev, [activeTab]: 0 }));

    const startTime = Date.now();
    const durationMs = feature.duration * 1000;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min((elapsed / durationMs) * 100, 100);

      setProgress((prev) => ({ ...prev, [activeTab]: percentage }));

      if (percentage >= 100) {
        window.clearInterval(interval);
        handleVideoEnd(activeTab);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [activeTab, videoErrors, handleVideoEnd]);

  // Update progress for the active video
  const updateProgress = (id: string, video: HTMLVideoElement) => {
    if (video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      setProgress((prev) => ({ ...prev, [id]: percentage }));
    }
  };

  const handleVideoError = (id: string) => {
    setVideoErrors((prev) => ({ ...prev, [id]: true }));
    setProgress((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="w-full mx-auto">
      <Tabs
        defaultValue={features[0].id}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex w-full mb-0 h-auto gap-2 sm:gap-3 lg:gap-4 bg-transparent p-0">
          {features.map((feature) => (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className={`relative flex-1 min-w-0 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-medium flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[50px] ${
                activeTab === feature.id && "!bg-transparent"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                {feature.icon}
                <span className="text-xs sm:text-sm font-medium text-center line-clamp-2 sm:line-clamp-1">
                  {feature.title}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-md overflow-hidden">
                <div
                  className={`h-full bg-primary transition-all duration-300 ease-in-out ${
                    activeTab === feature.id ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ width: `${progress[feature.id] || 0}%` }}
                />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {features.map((feature) => (
          <TabsContent
            key={feature.id}
            value={feature.id}
            className="mt-4 sm:mt-6 border rounded-lg overflow-hidden"
          >
            <div className="aspect-video relative">
              {videoErrors[feature.id] ? (
                <FeatureVideoFallback
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  step={Number(feature.id)}
                  totalSteps={features.length}
                />
              ) : (
                <video
                  key={getVideoUrl(feature)}
                  ref={(el) => {
                    videoRefs.current[feature.id] = el;
                  }}
                  className="w-full h-full object-contain rounded-xl"
                  src={getVideoUrl(feature)}
                  muted
                  autoPlay
                  playsInline
                  onTimeUpdate={(e) =>
                    updateProgress(feature.id, e.currentTarget)
                  }
                  onEnded={() => handleVideoEnd(feature.id)}
                  onError={() => handleVideoError(feature.id)}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
