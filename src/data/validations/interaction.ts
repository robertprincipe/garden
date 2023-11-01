import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { interactions } from "../db/schema";

export type NewInteraction = typeof interactions.$inferInsert;
export type Interaction = typeof interactions.$inferSelect & {
  user?: {
    name?: string;
    image?: string;
  };
};

export const interactionSchema = createInsertSchema(interactions, {
  chapterId: z.string().optional(),
  userId: z.string().optional(),
});
