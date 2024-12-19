import { WrapperForm } from "@/components/Wrappers";
import { Bounded } from "@/components/Bounded";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import RequestApiKeyForm from "@/components/modules/request-api-key/RequestApiKeyForm";

const ResquestApiKeyWithoutAuthPage = () => {
  return (
    <>
      <HeaderWithoutAuth />
      <Bounded center={true}>
        <WrapperForm>
          <Card className="w-full max-w-2xl mx-auto bg-muted/50 mt-10">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Request an API Key.
              </CardTitle>
              <CardDescription>
                Fill out the form below to request an API key without the need
                to connect your wallet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestApiKeyForm />
            </CardContent>
          </Card>
        </WrapperForm>
      </Bounded>
    </>
  );
};

export default ResquestApiKeyWithoutAuthPage;
