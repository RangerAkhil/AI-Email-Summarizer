import "dotenv/config";
import express from "express";
import cors from "cors";

import ingestRoutes from "./routes/ingest.js";
import emailRoutes from "./routes/emails.js";
import exportRoutes from "./routes/export.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => res.json({ ok: true, status: "UP" }));

app.use("/api", ingestRoutes);
app.use("/api", emailRoutes);
app.use("/api", exportRoutes);

const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
