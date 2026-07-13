import { z } from "zod/v3";
import type { KeysetPage } from "@/types/pagination.entity";

export function keysetPageSchema<T extends z.ZodType>(itemSchema: T) {
  return z.union([
    z.array(itemSchema).transform(
      (data): KeysetPage<z.infer<T>> => ({
        data,
        hasMore: false,
        nextCursor: null,
      }),
    ),
    z
      .object({
        data: z.array(itemSchema),
        hasMore: z.boolean().optional(),
        nextCursor: z.string().nullable().optional(),
      })
      .transform(
        (envelope): KeysetPage<z.infer<T>> => ({
          data: envelope.data,
          hasMore: envelope.hasMore ?? false,
          nextCursor: envelope.nextCursor ?? null,
        }),
      ),
  ]);
}

export function parseKeysetPageWithSchema<T extends z.ZodType>(
  itemSchema: T,
  data: unknown,
): KeysetPage<z.infer<T>> {
  const parsed = keysetPageSchema(itemSchema).safeParse(data);

  if (!parsed.success) {
    return {
      data: [],
      hasMore: false,
      nextCursor: null,
    };
  }

  return parsed.data;
}
