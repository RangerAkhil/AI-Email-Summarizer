import crypto from "crypto";

export function makeEmailHash(sender: string, subject: string, body: string): string {
    const raw = `${sender.trim()}|${subject.trim()}|${body.trim()}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
}
