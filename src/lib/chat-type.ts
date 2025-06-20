export interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export interface MessageGroup {
  [key: string]: Message[]
}
