/**
 * Project Fit Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { projectFitController } from "../controllers/project-fit.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * POST /project-fits
 * Create project fit - Public
 */
router.post("/", (req, res) => projectFitController.createProjectFit(req, res));

router.use(authenticate);

/**
 * GET /project-fits
 * Get all project fits - Admin only
 */
router.get("/", requireAdmin, (req, res) =>
  projectFitController.getAllProjectFits(req, res),
);

/**
 * GET /project-fits/:id
 * Get project fit by ID - Admin only
 */
router.get("/:id", requireAdmin, (req, res) =>
  projectFitController.getProjectFitById(req, res),
);

/**
 * PUT /project-fits/:id
 * Update project fit - Admin only
 */
router.put("/:id", requireAdmin, (req, res) =>
  projectFitController.updateProjectFit(req, res),
);

/**
 * DELETE /project-fits/:id
 * Delete project fit - Admin only
 */
router.delete("/:id", requireAdmin, (req, res) =>
  projectFitController.deleteProjectFit(req, res),
);

export default router;
