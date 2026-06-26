"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingPaths } from "@/components/floating-paths";

type AuthPageLayoutProps = {
  children: React.ReactNode;
};

export const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <section className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/10">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />

        <div className="relative z-10 mt-auto">
          <blockquote className="flex flex-col gap-2">
            <p className="text-xl">
              &ldquo;Integrate trust in hours, not months.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold">
              ~ Trustless Work
            </footer>
          </blockquote>
        </div>

        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col justify-center px-8 lg:h-full lg:min-h-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-60"
        >
          <div className="absolute -top-1/3 -right-1/4 size-[160%] rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-1/2 -right-1/4 size-[130%] -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
          <div className="absolute -bottom-1/3 -right-1/4 size-[150%] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>

        <Button asChild className="absolute top-7 left-5" variant="ghost">
          <Link href="/">
            <ChevronLeftIcon data-icon="inline-start" />
            Home
          </Link>
        </Button>

        <div className="mx-auto w-full max-w-sm space-y-4">
          <Link href="/" className="mx-auto">
            <Image
              src="/icon.png"
              alt="Trustless Work"
              width={100}
              height={100}
              className="mx-auto mb-10"
            />
          </Link>

          {children}
        </div>
      </section>
    </main>
  );
};
