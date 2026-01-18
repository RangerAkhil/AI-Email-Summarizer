import type { EmailRow } from "../api/emails";
import Loader from "./Loader";

type Props = {
    emails: EmailRow[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    onToggleAll: () => void;
    onOpen: (email: EmailRow) => void;
    onDelete: (id: string) => void;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    loading?: boolean;
};

export default function EmailTable({
    emails,
    selectedIds,
    onToggle,
    onToggleAll,
    onOpen,
    onDelete,
    pagination,
    onPageChange,
    loading,
}: Props) {
    const allChecked = emails.length > 0 && emails.every((e) => selectedIds.has(e.id));
    const { page, limit, total, totalPages } = pagination;
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50/90 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 backdrop-blur">
                    <tr className="border-b border-gray-200">
                        <th className="w-10 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={allChecked}
                                onChange={onToggleAll}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                        </th>

                        <th className="px-4 py-3">Sender</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Summarized</th>
                        <th className="px-4 py-3">Keywords</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {loading && <tr>
                        <td colSpan={7}><Loader /></td>
                    </tr>}
                    {emails.map((e) => (
                        <tr
                            key={e.id}
                            className="group hover:bg-gray-50/80 transition-colors"
                        >
                            <td className="px-4 py-3 align-middle">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(e.id)}
                                    onChange={() => onToggle(e.id)}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </td>

                            <td className="px-4 py-3 text-left align-middle text-gray-700">
                                <button onClick={() => onOpen(e)} title={e.sender} className="max-w-55 truncate font-medium cursor-pointer text-gray-800 hover:text-blue-700 hover:underline underline-offset-4 transition">
                                    {e.sender}
                                </button>
                            </td>

                            <td className="px-4 py-3 text-left align-middle">
                                <button
                                    className="max-w-105 truncate font-semibold cursor-pointer text-gray-900 hover:text-blue-700 hover:underline underline-offset-4 transition"
                                    onClick={() => onOpen(e)}
                                    title={e.subject}
                                >
                                    {e.subject}
                                </button>
                            </td>

                            <td className="px-4 py-3 align-middle">
                                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                                    {e.category}
                                </span>
                            </td>

                            <td className="px-4 py-3 align-middle">
                                {e.summaryCount > 0 ? (
                                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        🧠 {e.summaryCount}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                )}
                            </td>

                            <td className="px-4 py-3 align-middle">
                                <div className="flex flex-wrap gap-1">
                                    {(e.keywords || []).slice(0, 3).map((k) => (
                                        <span
                                            key={k}
                                            className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]"
                                        >
                                            {k}
                                        </span>
                                    ))}

                                    {(e.keywords || []).length > 3 && (
                                        <span className="inline-flex items-center text-xs font-medium text-gray-400">
                                            +{e.keywords.length - 3}
                                        </span>
                                    )}
                                </div>
                            </td>

                            <td className="px-4 py-3 align-middle text-right">
                                <button
                                    onClick={() => onDelete(e.id)}
                                    title="Delete"
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold cursor-pointer text-gray-700 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {emails.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center">
                                <div className="text-sm font-medium text-gray-600">No emails found.</div>
                                <div className="mt-1 text-xs text-gray-400">
                                    Try changing filters or refreshing.
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ✅ Pagination Footer */}
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-gray-500">
                    Showing <span className="font-medium text-gray-700">{from}</span> to{" "}
                    <span className="font-medium text-gray-700">{to}</span> of{" "}
                    <span className="font-medium text-gray-700">{total}</span>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={page <= 1}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        First
                    </button>

                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700">
                        Page {page} / {Math.max(totalPages, 1)}
                    </div>

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={page >= totalPages}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Last
                    </button>
                </div>
            </div>
        </div>
    );
}
