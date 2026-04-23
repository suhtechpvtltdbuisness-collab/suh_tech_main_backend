/**
 * Message Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { messageController } from "../controllers/message.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * POST /messages
 * Create message - Public
 */
router.post("/", (req, res) => messageController.createMessage(req, res));

router.use(authenticate);

/**
 * GET /messages
 * Get all messages - Admin only
 */
router.get("/", requireAdmin, (req, res) =>
  messageController.getAllMessages(req, res),
);

/**
 * GET /messages/:id
 * Get message by ID - Admin only
 */
router.get("/:id", requireAdmin, (req, res) =>
  messageController.getMessageById(req, res),
);

/**
 * PUT /messages/:id
 * Update message - Admin only
 */
router.put("/:id", requireAdmin, (req, res) =>
  messageController.updateMessage(req, res),
);

/**
 * DELETE /messages/:id
 * Delete message - Admin only
 */
router.delete("/:id", requireAdmin, (req, res) =>
  messageController.deleteMessage(req, res),
);

export default router;
