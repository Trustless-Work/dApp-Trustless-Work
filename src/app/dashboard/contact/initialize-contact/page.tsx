"use client";

import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { useContact } from "@/components/modules/contact/hooks/contact.hook";
import InitializeContactForm from "@/components/modules/contact/ui/forms/InitializeContactForm";

const InitializeContact = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const { handleCreateContact } = useContact();

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold">Create a New Contact</h1>
            <h2 className="text-muted-foreground">
              Add a trusted contact to your network.
            </h2>
          </div>

          <InitializeContactForm onSubmit={handleCreateContact} />
        </div>
      )}
    </>
  );
};

export default InitializeContact;
