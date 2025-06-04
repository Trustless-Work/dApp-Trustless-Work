import { Bounded } from "@/components/layout/Bounded";
import HelpAccordion from "@/components/modules/help/ui/utils/HelpAccordion";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { VideoSection } from "../sections/VideoSection";
import { RolesSection } from "../sections/RolesSection";
import { TableOfContents } from "../utils/TableContent";

const Help = () => {
  const { t } = useLanguage();
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return (
    <Bounded center={false}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="w-full shrink-0 block sm:hidden">
            <TableOfContents />
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <Card className={cn("overflow-hidden")} id="faqs">
              <CardContent className="p-6">
                <h1 className="text-4xl font-bold">{t("help.faqs.title")}</h1>
                <h2 className="my-2">
                  {t("help.faqs.subtitle")}{" "}
                  <Link
                    href="https://docs.trustlesswork.com/trustless-work"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm underline"
                  >
                    {t("help.faqs.askMoreQuestions")}
                  </Link>
                </h2>

                <HelpAccordion />
              </CardContent>
            </Card>

            <Card className={cn("overflow-hidden")} id="videos">
              <CardContent className="p-6">
                <h1 className="text-4xl font-bold">
                  {t("help.videoSectionTitle.title")}
                </h1>
                <h2 className="my-2">
                  {t("help.videos.subtitle")}{" "}
                  <Link
                    href="https://www.youtube.com/@TrustlessWork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm underline"
                  >
                    {t("reusable.moreInfoHere")}
                  </Link>
                </h2>

                <VideoSection />
              </CardContent>
            </Card>

            <Card className={cn("overflow-hidden")} id="roles">
              <CardContent className="p-6">
                <h1 className="text-4xl font-bold">{t("help.roles.title")}</h1>
                <h2 className="my-2">
                  {t("help.roles.subtitle")}{" "}
                  <Link
                    href="https://docs.trustlesswork.com/trustless-work/technology-overview/smart-escrow-design/roles-in-trustless-work"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm underline"
                  >
                    {t("reusable.moreInfoHere")}
                  </Link>
                </h2>

                <RolesSection />
              </CardContent>
            </Card>
          </div>

          <div className="w-64 shrink-0 hidden sm:block">
            <TableOfContents />
          </div>
        </div>
      )}
    </Bounded>
  );
};

export default Help;
