import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dealsRouter from "./routes/deals";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/deals", dealsRouter);

// In production, serve the built Vue client from the same service (single deploy).
const clientDist = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.listen(PORT, () => console.log(`PipelineIQ API listening on :${PORT}`));
