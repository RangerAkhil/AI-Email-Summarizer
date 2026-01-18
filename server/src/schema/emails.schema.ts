import { z } from "zod";

export const SummarizeBulkSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

export const ExportSelectedSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});