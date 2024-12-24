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
import WithAuthProtect from "@/helpers/WithAuth";

const ReportIssuePage = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <Card className="w-full max-w-2xl mx-auto bg-muted/50">
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
        </Card>
      </WrapperForm>
    </Bounded>
  );
};

export default WithAuthProtect(ReportIssuePage);
