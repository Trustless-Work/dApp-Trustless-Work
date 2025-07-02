import ReportIssueForm from "@/components/modules/report-issue/ui/forms/ReportIssueForm";
import { WrapperForm } from "@/components/layout/Wrappers";
import { Bounded } from "@/components/layout/Bounded";
import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ReportIssueNoLogged = () => {
  return (
    <>
      <HeaderWithoutAuth />
      <Bounded center={true}>
        <WrapperForm>
          <Card className="w-full max-w-2xl mx-auto bg-muted/50 mt-10">
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
    </>
  );
};

export default ReportIssueNoLogged;
