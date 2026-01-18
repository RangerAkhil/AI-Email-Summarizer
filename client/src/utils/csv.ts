export function downloadCsv(csvText: string, prefix = "email") {
    const d = new Date();

    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const year = d.getUTCFullYear();

    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");

    const filename = `${prefix}_${day}-${month}-${year}_${hh}-${mm}UTC.csv`;

    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
}
