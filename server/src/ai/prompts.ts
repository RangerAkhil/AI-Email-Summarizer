export const ALLOWED_CATEGORIES = [
    "Meeting",
    "Invoice",
    "Support Request",
    "HR",
    "General",
] as const;

export type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number];

export function summarizePrompt(input: { sender: string; subject: string; body: string }) {
    return `
Summarize this email in 2-3 sentences.
Assign ONE category from: ${ALLOWED_CATEGORIES.join(", ")}.
Extract 3-6 keywords.

Return ONLY JSON:
{
  "summary": "string",
  "category": "Meeting|Invoice|Support Request|HR|General",
  "keywords": ["string"]
}

Email:
Sender: ${input.sender}
Subject: ${input.subject}
Body: ${input.body}
`.trim();
}

export function resummarizePrompt(input: { sender: string; subject: string; body: string }) {
    return `
Re-summarize this email in 2-3 sentences.

Return ONLY JSON:
{
  "summary": "string"
}

Email:
Sender: ${input.sender}
Subject: ${input.subject}
Body: ${input.body}
`.trim();
}
