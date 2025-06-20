import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import { useHome } from "../../hooks/home.hook";
import { Bounded } from "@/components/layout/Bounded";
import { BackgroundLights } from "../utils/BackgroundLights";
import { HeroSection } from "../sections/Hero";
import { MissionSection } from "../sections/Mission";
import { HowItWorksSection } from "../sections/HowItWorks";
import { CTASection } from "../sections/CTA";
import { WhyEscrowsSection } from "../sections/WhyEscrows";
import { SmartEscrowSection } from "../sections/SmartEscrow";
import { MotionValue } from "framer-motion";
import { ConnectArrow } from "../utils/ConnectArrow";

import { FloatingChat } from "@/components/modules/chat/FLoatingChat";
import { useState } from "react";

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export const Home = () => {
  const homeHook = useHome();
  const containerRef = homeHook?.containerRef ?? null;
  const y1 = homeHook?.y1 as MotionValue<number>;
  const opacity = homeHook?.opacity as MotionValue<number>;
   const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const sendMessage = () => {
    if (inputMessage.trim() === "") return

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputMessage("")

    // Simular respuesta del bot después de un breve delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

    if (messageDate.getTime() === todayDate.getTime()) {
      return "Hoy"
    } else if (messageDate.getTime() === yesterdayDate.getTime()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  // Función para formatear la hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const dateKey = message.timestamp.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <>
      <HeaderWithoutAuth />
      <ConnectArrow />

      <Bounded center={true} className="mx-2 sm:mx-32">
        <main className="overflow-hidden" ref={containerRef}>
          <BackgroundLights />
          <HeroSection y1={y1} opacity={opacity} />
          <MissionSection />
          <WhyEscrowsSection />
          <HowItWorksSection />
          <SmartEscrowSection />
          <CTASection />
          <h1 className="text-center text-2xl font-bold mt-10">
            texting this to see if it works
          </h1>
       <FloatingChat
        messages={messages}
        setMessages={setMessages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
        formatDate={formatDate}
        formatTime={formatTime}
        messageGroups={messageGroups}
      />
        </main>
      </Bounded>
    </>
  );
};
