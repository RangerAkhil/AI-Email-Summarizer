import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    type EmailRow,
    deleteEmail,
    exportSelectedCsv,
    fetchEmailById,
    fetchEmails,
    ingestMockEmails,
    resummarizeOne,
    summarizeSelected,
} from "../api/emails";

import Toolbar from "../components/Toolbar";
import EmailTable from "../components/EmailTable";
import EmailDetailModal from "../components/EmailDetailModal";
import { downloadCsv } from "../utils/csv";
import { useDebouncedValue } from "../utils";

export default function Dashboard() {
    const [emails, setEmails] = useState<EmailRow[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("newest");

    const [loading, setLoading] = useState(false);

    const [openEmail, setOpenEmail] = useState<EmailRow | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const debouncedSearch = useDebouncedValue(search, { delay: 500 });

    async function load() {
        try {
            setLoading(true);
            const res = await fetchEmails({
                search: debouncedSearch.trim() || undefined,
                category: category !== "All" ? category : undefined,
                sort: sort as any,
                page: pagination.page,
                limit: pagination.limit,
            });
            setEmails(res.data);
            setPagination({
                page: res.pagination.page,
                limit: res.pagination.limit,
                total: res.pagination.total,
                totalPages: res.pagination.totalPages,
            });
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        setSelectedIds(new Set());

    }, [debouncedSearch, category, sort, pagination.limit, pagination.page]);


    const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);

    function toggleOne(id: string) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleAll() {
        const allIds = emails.map((e) => e.id);
        const allChecked = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allChecked) {
                allIds.forEach((id) => next.delete(id));
            } else {
                allIds.forEach((id) => next.add(id));
            }
            return next;
        });
    }

    async function handleIngest() {
        setLoading(true);
        try {
            const r = await ingestMockEmails();
            toast.success(`Ingested: ${r.inserted}, Skipped: ${r.skipped}`);
            await load();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSummarizeSelected() {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        const tId = toast.loading(`Summarizing ${ids.length} emails...`);
        setLoading(true);

        try {
            const r = await summarizeSelected(ids);

            const successCount = r.results.filter((x) => x.ok).length;
            const failCount = r.results.filter((x) => !x.ok).length;

            toast.success(
                `Summarized: ${successCount}${failCount ? ` | Failed: ${failCount}` : ""}`,
                { id: tId }
            );

            setSelectedIds(new Set());
            await load();
        } catch (err: any) {
            toast.error(err.message, { id: tId });
        } finally {
            setLoading(false);
        }
    }

    async function handleExportSelected() {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        const tId = toast.loading("Exporting selected CSV...");
        setLoading(true);

        try {
            const csv = await exportSelectedCsv(ids);
            downloadCsv(csv, "selected-emails");
            toast.success("Exported selected emails ✅", { id: tId });
        } catch (err: any) {
            toast.error(err.message, { id: tId });
        } finally {
            setLoading(false);
        }
    }

    async function openDetails(email: EmailRow) {
        const tId = toast.loading("Loading email...");
        setLoading(true);

        try {
            const res = await fetchEmailById(email.id);
            setOpenEmail(res.data);
            setModalOpen(true);
            toast.dismiss(tId);
        } catch (err: any) {
            toast.error(err.message, { id: tId });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        const tId = toast.loading("Deleting...");
        setLoading(true);

        try {
            await deleteEmail(id);

            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });

            toast.success("Deleted ✅", { id: tId });
            await load();
        } catch (err: any) {
            toast.error(err.message, { id: tId });
        } finally {
            setLoading(false);
        }
    }

    async function handleResummarizeFromModal() {
        if (!openEmail) return;

        const isFirst = openEmail.summaryCount === 0;
        const tId = toast.loading(isFirst ? "Summarizing..." : "Re-summarizing...");
        setLoading(true);

        try {
            if (isFirst) {
                await summarizeSelected([openEmail.id]);
            } else {
                await resummarizeOne(openEmail.id);
            }

            const res = await fetchEmailById(openEmail.id);
            setOpenEmail(res.data);

            toast.success(isFirst ? "Summarized ✅" : "Re-summarized ✅", { id: tId });
            await load();
        } catch (err: any) {
            toast.error(err.message, { id: tId });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl p-4 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">AI Email Summarizer</h1>
                    <p className="text-sm text-gray-600">
                        Bulk summarize selected emails, export CSV, search/filter/sort.
                    </p>
                </div>

                <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm border">
                    <Toolbar
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                        sort={sort}
                        setSort={setSort}
                        selectedCount={selectedCount}
                        onIngest={handleIngest}
                        onSummarizeSelected={handleSummarizeSelected}
                        onExportSelected={handleExportSelected}

                        loading={loading}
                    />
                </div>

                <EmailTable
                    emails={emails}
                    selectedIds={selectedIds}
                    onToggle={toggleOne}
                    onToggleAll={toggleAll}
                    onOpen={openDetails}
                    onDelete={handleDelete}
                    pagination={pagination}
                    onPageChange={(newPage) => {
                        setSelectedIds(new Set());
                        setPagination((prev) => ({
                            ...prev,
                            page: newPage,
                        }))
                    }}
                    loading={modalOpen ? false : loading}
                />

                <EmailDetailModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    email={openEmail}
                    onResummarize={handleResummarizeFromModal}
                    loading={loading}
                />
            </div>
        </div>
    );
}
