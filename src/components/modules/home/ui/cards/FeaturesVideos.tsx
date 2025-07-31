"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  CheckCircle,
  CheckSquare,
  DollarSign,
  Home,
  Layers,
  LockIcon,
  LockOpenIcon,
} from "lucide-react";

const features = [
  {
    id: "1",
    title: "Deploy an Escrow",
    videoUrl: "/videos/features-video-1.mp4",
    duration: 18,
    icon: <Layers />,
  },
  {
    id: "2",
    title: "Fund Escrow",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 12,
    icon: <DollarSign />,
  },
  {
    id: "3",
    title: "Complete Milestone",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: 18,
    icon: <CheckSquare />,
  },
  {
    id: "4",
    title: "Approve Milestone",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    duration: 14,
    icon: <CheckCircle />,
  },
  {
    id: "5",
    title: "Release Funds",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    duration: 16,
    icon: <LockOpenIcon />,
  },
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(features[0].id);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

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
        <TabsList className="grid grid-cols-5 mb-0 h-auto gap-4  bg-transparent">
          {features.map((feature) => (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className="relative py-3 text-base font-medium flex items-center gap-2"
            >
              {feature.icon}
              <span className="text-sm font-medium">{feature.title}</span>

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
            className="mt-6 border rounded-lg overflow-hidden "
          >
            <div className="aspect-video relative">
              <video
                ref={(el) => {
                  videoRefs.current[feature.id] = el;
                }}
                className="w-full h-full object-contain border-2 border-muted rounded-xl"
                src={feature.videoUrl}
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
