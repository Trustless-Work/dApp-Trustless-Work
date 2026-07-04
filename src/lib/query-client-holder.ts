import type { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function registerQueryClient(client: QueryClient): void {
  queryClient = client;
}

export function getRegisteredQueryClient(): QueryClient | null {
  return queryClient;
}
