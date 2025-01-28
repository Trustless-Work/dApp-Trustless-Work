"use client";

import ReportIssueForm from "@/components/modules/report-issue/ReportIssueForm";
import { WrapperForm } from "@/components/layout/Wrappers";
import { Bounded } from "@/components/layout/Bounded";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ReportIssuePage: React.FC = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <Card className={cn("overflow-hidden")}>
          <div className="p-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Report an API Issue
              </CardTitle>
              <CardDescription>
                Fill in the details below to report an API issue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportIssueForm />
            </CardContent>
          </div>
        </Card>
      </WrapperForm>
    </Bounded>
  );
};

export default ReportIssuePage;
