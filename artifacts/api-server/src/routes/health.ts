import { Router, type IRouter } from "express";

const router: IRouter = Router();

// FIX: changed /healthz → / (so final path becomes /api/health)
router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
