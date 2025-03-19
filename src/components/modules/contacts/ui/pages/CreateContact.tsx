"use client";

import Loader from "@/components/utils/ui/Loader";
import CreateContactForm from "../forms/CreateContactForm";
import { useGlobalUIBoundedStore } from "@/core/store/ui";

const CreateContactPage = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">
            Fill in the details of the Contact
          </h1>
          <h2>Fill in the details below to add a new contact to your list.</h2>
          <CreateContactForm />
        </div>
      )}
    </>
  );
};

export default CreateContactPage;
