"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  CheckCircle,
  CheckSquare,
  DollarSign,
  Layers,
  LockOpenIcon,
} from "lucide-react";
import { useGlobalUIBoundedStore } from "@/store/ui";

type VideoUrl = string | { dark: string; light: string };

interface Feature {
  id: string;
  title: string;
  videoUrl: VideoUrl;
  duration: number;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: "1",
    title: "Deploy an Escrow",
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
  const [progress, setProgress] = useState<Record<string, number>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  // Get the appropriate video URL based on current theme
  const getVideoUrl = (feature: Feature): string => {
    // If the videoUrl is an object with dark/light variants, use theme-based selection
    if (
      typeof feature.videoUrl === "object" &&
      "dark" in feature.videoUrl &&
      "light" in feature.videoUrl
    ) {
      const videoUrlObj = feature.videoUrl as { dark: string; light: string };
      return videoUrlObj[theme as "dark" | "light"];
    }
    // Fallback to the original videoUrl if it's a string
    return typeof feature.videoUrl === "string"
      ? feature.videoUrl
      : (feature.videoUrl as { dark: string; light: string }).dark;
  };

  // Initialize progress for all tabs
  useEffect(() => {
    const initialProgress: Record<string, number> = {};
    features.forEach((feature) => {
      initialProgress[feature.id] = 0;
    });
    setProgress(initialProgress);
  }, []);

  // Auto-play the first video when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstVideo = videoRefs.current[features[0].id];
      if (firstVideo) {
        firstVideo.currentTime = 0;
        firstVideo.muted = true;
        firstVideo.play().catch((e) => {
          console.error("Error playing first video:", e);
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Pause all videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
      }
    });

    // Play the selected video from where it left off
    setTimeout(() => {
      const selectedVideo = videoRefs.current[value];
      if (selectedVideo) {
        selectedVideo.muted = true; // Ensure it's muted
        selectedVideo.play().catch((e) => {
          console.error("Error playing video:", e);
          // If autoplay fails, try again after user interaction
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
  };

  // Move to the next tab when video ends
  const handleVideoEnd = (currentId: string) => {
    const currentIndex = features.findIndex((f) => f.id === currentId);
    const nextIndex = (currentIndex + 1) % features.length;
    const nextId = features[nextIndex].id;

    // Set progress to 100% for the completed video
    setProgress((prev) => ({ ...prev, [currentId]: 100 }));

    // Change to the next tab after a short delay
    setTimeout(() => {
      handleTabChange(nextId);
    }, 500);
  };

  // Update progress for the active video
  const updateProgress = (id: string, video: HTMLVideoElement) => {
    if (video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      setProgress((prev) => ({ ...prev, [id]: percentage }));
    }
  };

  return (
    <div className="w-full mx-auto">
      <Tabs
        defaultValue={features[0].id}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-0 h-auto gap-2 sm:gap-3 lg:gap-4 bg-transparent">
          {features.map((feature) => (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className={`relative py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-medium flex flex-col sm:flex-row items-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[50px] ${
                activeTab === feature.id && "!bg-transparent"
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                {feature.icon}
                <span className="text-xs sm:text-sm font-medium text-center sm:text-left line-clamp-2 sm:line-clamp-1">
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
              <video
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
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
