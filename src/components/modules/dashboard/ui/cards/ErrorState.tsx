import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import React from "react";

interface ErrorStateProps {
  message?: string;
}
const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message || "Failed to load escrow data. Please try again."}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
