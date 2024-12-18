import { Bounded } from "@/components/Bounded";
import RequestApiKeyForm from "@/components/modules/request-api-key/RequestApiKeyForm";
import { WrapperForm } from "@/components/Wrappers";

export default function RequestApyKeyPage() {
  return (
    <div>
      <Bounded center={true}>
        <WrapperForm>
          <RequestApiKeyForm />
        </WrapperForm>
      </Bounded>
    </div>
  );
}
