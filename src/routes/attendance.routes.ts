/**
 * Attendance Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { attendanceController } from "../controllers/attendance.controller.js";
import {
  authenticate,
  requireAdmin,
} from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/attendances
 * Get all attendances - Authenticated users
 * Query params: userId, startDate, endDate, status, date (filters by created_at)
 */
router.get("/", authenticate, (req, res) =>
  attendanceController.getAllAttendances(req, res),
);

/**
 * POST /api/attendances
 * Mark attendance - Admin can mark for any user, users can mark for themselves
 */
router.post("/", authenticate, (req, res) =>
  attendanceController.createAttendance(req, res),
);

/**
 * GET /api/attendances/user/:userId
 * Get attendances for specific user - Authenticated users
 * Query params: startDate, endDate
 */
router.get("/user/:userId", authenticate, (req, res) =>
  attendanceController.getUserAttendances(req, res),
);

/**
 * GET /api/attendances/user/:userId/stats
 * Get attendance statistics for specific user - Authenticated users
 * Query params: startDate, endDate
 */
router.get(
  "/user/:userId/stats",
  authenticate,
  (req, res) => attendanceController.getAttendanceStats(req, res),
);

/**
 * GET /api/attendances/:id
 * Get attendance by ID - Authenticated users
 */
router.get("/:id", authenticate, (req, res) =>
  attendanceController.getAttendanceById(req, res),
);

/**
 * PATCH /api/attendances/:id
 * Update attendance (clockIn/clockOut) - Authenticated users
 */
router.patch("/:id", authenticate, (req, res) =>
  attendanceController.updateAttendance(req, res),
);

/**
 * PUT /api/attendances/:id
 * Update attendance - Authenticated users
 */
router.put("/:id", authenticate, (req, res) =>
  attendanceController.updateAttendance(req, res),
);

/**
 * DELETE /api/attendances/:id
 * Delete attendance - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  attendanceController.deleteAttendance(req, res),
);

export default router;
