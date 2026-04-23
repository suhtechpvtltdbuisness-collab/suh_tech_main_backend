/**
 * Project Fit Controller
 * Handles HTTP requests and responses for project fit operations
 */

import { Request, Response } from "express";
import { projectFitService } from "../services/project-fit.service.js";

export class ProjectFitController {
  async getAllProjectFits(req: Request, res: Response) {
    try {
      const filters: { status?: string } = {};

      if (req.query.status) {
        filters.status = String(req.query.status);
      }

      const projectFits = await projectFitService.getAllProjectFits(filters);

      res.json({
        success: true,
        data: projectFits,
      });
    } catch (error) {
      console.error("Get project fits error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch project fits",
      });
    }
  }

  async getProjectFitById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project fit ID",
        });
      }

      const projectFit = await projectFitService.getProjectFitById(id);

      res.json({
        success: true,
        data: projectFit,
      });
    } catch (error: any) {
      console.error("Get project fit error:", error);

      if (error.message === "Project fit not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch project fit",
      });
    }
  }

  async createProjectFit(req: Request, res: Response) {
    try {
      const payload = {
        name: req.body.name,
        company: req.body.company,
        contactNo: req.body.contactNo,
        email: req.body.email,
        focus: req.body.focus,
        status: req.body.status,
      };

      const projectFit = await projectFitService.createProjectFit(payload);

      res.status(201).json({
        success: true,
        message: "Project fit created successfully",
        data: projectFit,
      });
    } catch (error: any) {
      console.error("Create project fit error:", error);

      if (error.message.includes("required")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create project fit",
      });
    }
  }

  async updateProjectFit(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project fit ID",
        });
      }

      const payload = {
        name: req.body.name,
        company: req.body.company,
        contactNo: req.body.contactNo,
        email: req.body.email,
        focus: req.body.focus,
        status: req.body.status,
      };

      const projectFit = await projectFitService.updateProjectFit(id, payload);

      res.json({
        success: true,
        message: "Project fit updated successfully",
        data: projectFit,
      });
    } catch (error: any) {
      console.error("Update project fit error:", error);

      if (error.message === "Project fit not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update project fit",
      });
    }
  }

  async deleteProjectFit(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project fit ID",
        });
      }

      const result = await projectFitService.deleteProjectFit(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete project fit error:", error);

      if (error.message === "Project fit not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete project fit",
      });
    }
  }
}

export const projectFitController = new ProjectFitController();
