import { api } from "./client";

export type EmailRow = {
    id: string;
    sender: string;
    subject: string;
    body: string;

    summary: string | null;
    category: string;

    keywords: string[];
    summaryCount: number;

    createdAt: string;
    updatedAt: string;
    lastSummarizedAt: string | null;
};

export async function ingestMockEmails() {
    const res = await api.post("/api/ingest");
    return res.data as { ok: boolean; inserted: number; skipped: number; total: number };
}

export async function fetchEmails(params?: {
    search?: string;
    category?: string;
    sort?: "newest" | "oldest" | "count";
    page?: number;
    limit?: number;
}) {
    const res = await api.get("/api/emails", { params });
    return res.data as { ok: boolean; data: EmailRow[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
}

export async function fetchEmailById(id: string) {
    const res = await api.get(`/api/emails/${id}`);
    return res.data as { ok: boolean; data: EmailRow };
}

export async function summarizeSelected(ids: string[]) {
    const res = await api.post("/api/emails/summarize", { ids });
    return res.data as {
        ok: boolean;
        results: { id: string; ok: boolean; error?: string }[];
    };
}

export async function resummarizeOne(id: string) {
    const res = await api.post(`/api/emails/${id}/resummarize`);
    return res.data as { ok: boolean };
}

export async function deleteEmail(id: string) {
    const res = await api.delete(`/api/emails/${id}`);
    return res.data as { ok: boolean };
}

export async function exportSelectedCsv(ids: string[]) {
    const res = await api.post("/api/summaries/export", { ids }, { responseType: "text" });
    return res.data as string;
}

export async function exportAllCsv() {
    const res = await api.get("/api/summaries/export", { responseType: "text" });
    return res.data as string;
}
