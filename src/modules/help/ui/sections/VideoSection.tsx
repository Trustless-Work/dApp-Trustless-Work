import { videos as video } from "../../constants/video-items.constant";
import { useLanguage } from "@/hooks/useLanguage";
import { VideoCard } from "../utils/VideoCard";

export const VideoSection = () => {
  const { t } = useLanguage();
  const videos = video.map((videoKey) => ({
    id: videoKey.id,
    title: t(videoKey.title),
    description: t(videoKey.description),
    videoId: videoKey.videoId,
  }));

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
