export function safeJsonParse<T = any>(text: string): T {
    try {
        return JSON.parse(text) as T;
    } catch (e) {
        if (process.env.NODE_ENV === "development") {
            console.log("JSON parse failed, trying fallback:", e);
        }
    }

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const sliced = text.slice(firstBrace, lastBrace + 1);
        return JSON.parse(sliced) as T;
    }

    throw new Error("OpenAI response was not valid JSON");
}
