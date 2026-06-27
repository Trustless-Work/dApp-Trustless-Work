"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TypingAnimation } from "@/components/ui/typing-animation";

export const HeroSection = () => {
  return (
    <section className="min-h-[95vh] flex flex-col justify-center relative w-full">
      <div className="z-10 relative">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
            <span className="text-black/80 dark:text-white/80">Welcome to</span>{" "}
            <br />
            <span className="font-black">Trustless Work</span>
          </h1>
        </div>

        <div className="max-w-2xl">
          <p className="text-xl md:text-2xl mb-4">
            <strong className="text-primary font-bold">
              Escrow-as-a-service
            </strong>{" "}
            platform designed to secure transactions with transparency,
            efficiency, and scalability.
          </p>

          <div className="h-16 my-6 relative">
            <TypingAnimation className="text-3xl md:text-4xl font-bold">
              Integrate trust in hours, not months.
            </TypingAnimation>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="https://www.trustlesswork.com">
              <Button size="lg" className="group">
                Explore
                <span className="inline-block ml-2">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </Link>

            <Link href="https://docs.trustlesswork.com/trustless-work">
              <Button size="lg" variant="outline" className="group">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
