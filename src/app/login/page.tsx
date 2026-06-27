import { Suspense } from "react";
import { LoginView } from "@/features/auth/ui/LoginView";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
}
