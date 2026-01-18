import { Parser } from "json2csv";

interface ExportEmail {
    sender: string;
    subject: string;
    email: string;
    summary: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function emailsToCsv(rows: ExportEmail[]): string {
    const parser = new Parser({
        fields: [
            "sender",
            "subject",
            "email",
            "summary",
            "createdAt",
            "updatedAt",
        ],
    });

    return parser.parse(rows);
}
