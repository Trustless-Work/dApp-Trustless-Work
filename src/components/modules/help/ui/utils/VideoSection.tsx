import { videos } from "../../constants/video-items.constant";
import { VideoCard } from "./VideoCard";

export const VideoSection = () => {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
