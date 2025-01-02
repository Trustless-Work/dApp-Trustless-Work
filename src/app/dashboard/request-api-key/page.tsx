"use client";

import { Bounded } from "@/components/layout/Bounded";
import RequestApiKeyForm from "@/components/modules/request-api-key/RequestApiKeyForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WrapperForm } from "@/components/layout/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const RequestApyKeyPage = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <Card className="w-full max-w-2xl mx-auto bg-muted/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Request an API Key.
            </CardTitle>
            <CardDescription>
              Fill out the form below to request an API key without the need to
              connect your wallet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RequestApiKeyForm />
          </CardContent>
        </Card>
      </WrapperForm>
    </Bounded>
  );
};

export default RequestApyKeyPage;
