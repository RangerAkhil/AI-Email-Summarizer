import { z } from "zod";

const MockEmailSchema = z.object({
    sender: z.string(),
    subject: z.string(),
    body: z.string(),
});

export const MockEmailsSchema = z.array(MockEmailSchema);
