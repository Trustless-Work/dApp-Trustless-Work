"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4">
      <figure className="mx-auto flex w-full max-w-lg flex-col items-center justify-center text-center">
        <Image
          src="/icon.png"
          alt="Trustless Work"
          width={90}
          height={90}
          className="mb-4"
        />

        <h1 className="text-6xl font-bold uppercase">Page Not Found</h1>

        <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] mx-auto my-5 h-px w-full max-w-sm bg-border" />

        <figcaption className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center space-y-0.5">
            <cite className="font-medium text-foreground text-xl not-italic">
              You are lost, go back to the previous page.
            </cite>

            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
