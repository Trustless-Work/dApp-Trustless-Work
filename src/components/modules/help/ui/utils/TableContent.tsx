"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { Section } from "../../@types/setion.entity";
import { HelpCircle, Users, VideoIcon } from "lucide-react";

export const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = useMemo<Section[]>(
    () => [
      { id: "faqs", title: "FAQs", icon: <HelpCircle /> },
      { id: "videos", title: "Video Tutorials", icon: <VideoIcon /> },
      { id: "roles", title: "Roles in the Escrows", icon: <Users /> },
    ],
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Card className="p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-auto">
      <h3 className="font-medium mb-4 text-lg">Help Content</h3>
      <div className="space-y-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left",
              activeSection === section.id &&
                "bg-accent text-accent-foreground",
            )}
            onClick={() => scrollToSection(section.id)}
          >
            {section.icon}
            {section.title}
          </Button>
        ))}
      </div>
    </Card>
  );
};
