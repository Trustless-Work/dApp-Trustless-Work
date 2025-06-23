"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-105 z-50"
      variant={isOpen ? "secondary" : "default"}
      size="icon"
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <MessageCircle className="h-5 w-5" />
      )}
    </Button>
  );
}
