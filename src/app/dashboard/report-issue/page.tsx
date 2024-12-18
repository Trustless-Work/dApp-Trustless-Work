import { ReportIssueForm } from "@/components/modules/report-issue/ReportIssueForm";
import { WrapperForm } from "@/components/Wrappers";
import { Bounded } from "@/components/Bounded";

export default function Page() {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <h1 className="text-4xl font-bold">Report an API Issue</h1>
        <h2>Fill in the details below to report an API issue.</h2>
        <ReportIssueForm />
      </WrapperForm>
    </Bounded>
  );
}
