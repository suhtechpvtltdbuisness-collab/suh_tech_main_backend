/**
 * Message Repository
 * Handles all database operations for messages
 */

import { pool } from "../db/dbConnection.js";

export class MessageRepository {
  async findAll() {
    const result = await pool.query(
      `SELECT id, name, email, message, created_at, updated_at
       FROM messages
       WHERE is_deleted = false
       ORDER BY created_at DESC`,
    );

    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, name, email, message, created_at, updated_at
       FROM messages
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    return result.rows[0] || null;
  }

  async create(data: { name: string; email: string; message: string }) {
    const result = await pool.query(
      `INSERT INTO messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, message, created_at, updated_at`,
      [data.name, data.email, data.message],
    );

    return result.rows[0];
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      message?: string;
    },
  ) {
    const result = await pool.query(
      `UPDATE messages
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           message = COALESCE($3, message),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND is_deleted = false
       RETURNING id, name, email, message, created_at, updated_at`,
      [data.name, data.email, data.message, id],
    );

    return result.rows[0] || null;
  }

  async delete(id: number) {
    const result = await pool.query(
      `UPDATE messages
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id],
    );

    return result.rows[0] || null;
  }
}

export const messageRepository = new MessageRepository();
