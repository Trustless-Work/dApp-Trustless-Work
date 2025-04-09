import { Bounded } from "@/components/layout/Bounded";
import HelpAccordion from "@/components/modules/help/ui/utils/HelpAccordion";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { cn } from "@/lib/utils";
import { VideoSection } from "../utils/VideoSection";

const Help = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return (
    <Bounded center={true}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <Card className={cn("overflow-hidden")}>
            <CardContent className="p-6">
              <h1 className="text-4xl font-bold">FAQs</h1>
              <h2 className="my-2">
                Find answers to common questions about our escrow service.
              </h2>

              <HelpAccordion />
            </CardContent>
          </Card>

          <Card className={cn("overflow-hidden")}>
            <CardContent className="p-6">
              <h1 className="text-4xl font-bold">Video Tutorials</h1>
              <h2 className="my-2">
                Watch our video tutorials to learn how to use our escrow service
                effectively through videos.
              </h2>

              <VideoSection />
            </CardContent>
          </Card>
        </div>
      )}
    </Bounded>
  );
};

export default Help;
