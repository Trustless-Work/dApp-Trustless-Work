import { Video } from "@/@types/video.entity";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play } from "lucide-react";
import { useState } from "react";

export const VideoCard = ({ video }: { video: Video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden">
        {isPlaying ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div
            className="w-full h-full bg-muted flex items-center justify-center cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="relative z-10 bg-primary/90 rounded-full p-4 group-hover:bg-primary transition-colors">
              <Play className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {video.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
