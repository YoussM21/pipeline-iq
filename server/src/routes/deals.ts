import { Router, Request, Response } from "express";
import { STAGES, Stage, DealInput } from "../types";
import * as db from "../db";

const router = Router();

function validate(body: any): { ok: true; value: DealInput } | { ok: false; error: string } {
  const { name, company, value, stage, owner } = body ?? {};
  if (typeof name !== "string" || !name.trim()) return { ok: false, error: "name is required" };
  if (typeof company !== "string" || !company.trim()) return { ok: false, error: "company is required" };
  if (typeof value !== "number" || value < 0) return { ok: false, error: "value must be a non-negative number" };
  if (!STAGES.includes(stage as Stage)) return { ok: false, error: `stage must be one of ${STAGES.join(", ")}` };
  if (typeof owner !== "string" || !owner.trim()) return { ok: false, error: "owner is required" };
  return { ok: true, value: { name: name.trim(), company: company.trim(), value, stage, owner: owner.trim() } };
}

router.get("/", (_req: Request, res: Response) => {
  res.json(db.listDeals());
});

router.get("/stats", (_req: Request, res: Response) => {
  res.json(db.stats());
});

router.post("/", (req: Request, res: Response) => {
  const result = validate(req.body);
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.status(201).json(db.createDeal(result.value));
});

router.patch("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = db.getDeal(id);
  if (!existing) return res.status(404).json({ error: "deal not found" });

  // Allow partial updates (e.g. just moving stage) but validate any field present.
  const patch: Partial<DealInput> = {};
  const b = req.body ?? {};
  if ("name" in b) patch.name = String(b.name).trim();
  if ("company" in b) patch.company = String(b.company).trim();
  if ("value" in b) {
    if (typeof b.value !== "number" || b.value < 0) return res.status(400).json({ error: "value must be a non-negative number" });
    patch.value = b.value;
  }
  if ("stage" in b) {
    if (!STAGES.includes(b.stage)) return res.status(400).json({ error: "invalid stage" });
    patch.stage = b.stage;
  }
  if ("owner" in b) patch.owner = String(b.owner).trim();

  res.json(db.updateDeal(id, patch));
});

router.delete("/:id", (req: Request, res: Response) => {
  const ok = db.deleteDeal(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "deal not found" });
  res.status(204).end();
});

export default router;
