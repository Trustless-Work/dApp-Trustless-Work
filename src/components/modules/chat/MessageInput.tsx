"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useState } from "react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [inputMessage, setInputMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() === "" || disabled) return

    onSendMessage(inputMessage.trim())
    setInputMessage("")
  }

  return (
    <form className="flex w-full gap-2" onSubmit={handleSubmit}>
      <Input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="flex-1"
        disabled={disabled}
      />
      <Button type="submit" size="icon" variant="default" disabled={disabled || !inputMessage.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
