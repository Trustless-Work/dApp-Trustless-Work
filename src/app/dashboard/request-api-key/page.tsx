import { Bounded } from "@/components/Bounded";
import ContactForm from "@/components/modules/contact/ContactForm";
import { WrapperForm } from "@/components/Wrappers";

export default function RequestApyKeyPage() {
  return (
    <div>
      <Bounded center={true}>
        <WrapperForm>
          <ContactForm />
        </WrapperForm>
      </Bounded>
    </div>
  );
}
