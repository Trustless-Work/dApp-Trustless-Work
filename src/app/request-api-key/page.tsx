import { Bounded } from "@/components/Bounded";
import ContactForm from "@/components/modules/contact/ContactForm";
import { WrapperForm } from "@/components/Wrappers";

export default function RequestApyKeyPage() {
  return (
    <div>
       <Bounded center={true}>
          <WrapperForm>
            <h1 className="text-4xl font-bold">Request</h1>
            <h2>Fill in the details below to fund an escrow.</h2>
            <ContactForm />
          </WrapperForm>
        </Bounded>
    </div>
  );
}