import type { Message, MessageGroup } from "./chat-type";

// Función para formatear la fecha
export const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayDate = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (messageDate.getTime() === todayDate.getTime()) {
    return "Hoy";
  } else if (messageDate.getTime() === yesterdayDate.getTime()) {
    return "Ayer";
  } else {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

// Función para formatear la hora
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Agrupar mensajes por fecha
export const groupMessagesByDate = (messages: Message[]): MessageGroup => {
  const groups: MessageGroup = {};

  messages.forEach((message) => {
    const dateKey = message.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  return groups;
};

// Generar respuesta automática del bot
export const generateBotResponse = (): string => {
  const responses = [
    "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto.",
    "Entiendo tu consulta. ¿Hay algo más en lo que pueda ayudarte?",
    "He registrado tu solicitud. Te responderemos a la brevedad.",
    "Perfecto, estamos procesando tu consulta.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};
