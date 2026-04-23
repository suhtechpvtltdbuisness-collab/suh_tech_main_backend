/**
 * Project Fit Service
 * Contains business logic for project fit operations
 */

import { projectFitRepository } from "../repositories/project-fit.repository.js";

export class ProjectFitService {
  async getAllProjectFits(filters?: { status?: string }) {
    const projectFits = await projectFitRepository.findAll(filters);
    return projectFits.map((projectFit) =>
      this.formatProjectFitResponse(projectFit),
    );
  }

  async getProjectFitById(id: number) {
    const projectFit = await projectFitRepository.findById(id);
    if (!projectFit) {
      throw new Error("Project fit not found");
    }

    return this.formatProjectFitResponse(projectFit);
  }

  async createProjectFit(data: {
    name: string;
    company: string;
    contactNo: string;
    email: string;
    focus: string;
    status?: string;
  }) {
    if (
      !data.name ||
      !data.company ||
      !data.contactNo ||
      !data.email ||
      !data.focus
    ) {
      throw new Error(
        "Name, company, contact number, email, and focus are required",
      );
    }

    const created = await projectFitRepository.create({
      name: String(data.name).trim(),
      company: String(data.company).trim(),
      contactNo: String(data.contactNo).trim(),
      email: String(data.email).trim(),
      focus: String(data.focus).trim(),
      status: data.status ? String(data.status).trim() : "pending",
    });

    return this.formatProjectFitResponse(created);
  }

  async updateProjectFit(
    id: number,
    data: {
      name?: string;
      company?: string;
      contactNo?: string;
      email?: string;
      focus?: string;
      status?: string;
    },
  ) {
    const existing = await projectFitRepository.findById(id);
    if (!existing) {
      throw new Error("Project fit not found");
    }

    const updated = await projectFitRepository.update(id, {
      name: data.name !== undefined ? String(data.name).trim() : undefined,
      company:
        data.company !== undefined ? String(data.company).trim() : undefined,
      contactNo:
        data.contactNo !== undefined
          ? String(data.contactNo).trim()
          : undefined,
      email: data.email !== undefined ? String(data.email).trim() : undefined,
      focus: data.focus !== undefined ? String(data.focus).trim() : undefined,
      status:
        data.status !== undefined ? String(data.status).trim() : undefined,
    });

    if (!updated) {
      throw new Error("Failed to update project fit");
    }

    return this.formatProjectFitResponse(updated);
  }

  async deleteProjectFit(id: number) {
    const existing = await projectFitRepository.findById(id);
    if (!existing) {
      throw new Error("Project fit not found");
    }

    const deleted = await projectFitRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete project fit");
    }

    return { message: "Project fit deleted successfully" };
  }

  private formatProjectFitResponse(projectFit: any) {
    return {
      id: projectFit.id,
      name: projectFit.name,
      company: projectFit.company,
      contactNo: projectFit.contact_no,
      email: projectFit.email,
      focus: projectFit.focus,
      status: projectFit.status,
      createdAt: projectFit.created_at,
      updatedAt: projectFit.updated_at,
    };
  }
}

export const projectFitService = new ProjectFitService();
