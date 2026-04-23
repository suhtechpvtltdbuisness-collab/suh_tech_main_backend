/**
 * Project Fit Repository
 * Handles all database operations for project fits
 */

import { pool } from "../db/dbConnection.js";

export class ProjectFitRepository {
  async findAll(filters?: { status?: string }) {
    let query = `
      SELECT id, name, company, contact_no, email, focus, status, created_at, updated_at
      FROM project_fits
      WHERE is_deleted = false
    `;

    const params: any[] = [];

    if (filters?.status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(filters.status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, name, company, contact_no, email, focus, status, created_at, updated_at
       FROM project_fits
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    return result.rows[0] || null;
  }

  async create(data: {
    name: string;
    company: string;
    contactNo: string;
    email: string;
    focus: string;
    status: string;
  }) {
    const result = await pool.query(
      `INSERT INTO project_fits (name, company, contact_no, email, focus, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, company, contact_no, email, focus, status, created_at, updated_at`,
      [
        data.name,
        data.company,
        data.contactNo,
        data.email,
        data.focus,
        data.status,
      ],
    );

    return result.rows[0];
  }

  async update(
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
    const result = await pool.query(
      `UPDATE project_fits
       SET name = COALESCE($1, name),
           company = COALESCE($2, company),
           contact_no = COALESCE($3, contact_no),
           email = COALESCE($4, email),
           focus = COALESCE($5, focus),
           status = COALESCE($6, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND is_deleted = false
       RETURNING id, name, company, contact_no, email, focus, status, created_at, updated_at`,
      [
        data.name,
        data.company,
        data.contactNo,
        data.email,
        data.focus,
        data.status,
        id,
      ],
    );

    return result.rows[0] || null;
  }

  async delete(id: number) {
    const result = await pool.query(
      `UPDATE project_fits
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id],
    );

    return result.rows[0] || null;
  }
}

export const projectFitRepository = new ProjectFitRepository();
