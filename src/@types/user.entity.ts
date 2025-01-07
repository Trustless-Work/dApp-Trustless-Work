export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  email?: string;
  identification?: string;
}

export type UserPayload = Omit<User, "createdAt" | "updatedAt" | "id">;
