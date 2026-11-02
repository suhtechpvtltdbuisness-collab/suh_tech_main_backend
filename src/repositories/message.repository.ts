/**
 * Message Repository
 * Handles all database operations for messages
 */

import { pool } from "../db/dbConnection.js";

let schemaReady: Promise<void> | undefined;

/**
 * Idempotent safety net so contact submissions keep working even if the
 * migration has not been run on this database yet (e.g. a fresh Vercel deploy).
 */
function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS messages (
           id SERIAL PRIMARY KEY,
           name VARCHAR(255) NOT NULL,
           email VARCHAR(255) NOT NULL,
           phone VARCHAR(30),
           message TEXT NOT NULL,
           created_at TIMESTAMP NOT NULL DEFAULT NOW(),
           updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
           is_deleted BOOLEAN NOT NULL DEFAULT FALSE
         )`,
      );
      await pool.query(
        "ALTER TABLE messages ADD COLUMN IF NOT EXISTS phone VARCHAR(30)",
      );
    })().catch((error) => {
      schemaReady = undefined; // retry on next request
      throw error;
    });
  }
  return schemaReady;
}

const COLUMNS = "id, name, email, phone, message, created_at, updated_at";

export class MessageRepository {
  async findAll() {
    await ensureSchema();
    const result = await pool.query(
      `SELECT ${COLUMNS}
       FROM messages
       WHERE is_deleted = false
       ORDER BY created_at DESC`,
    );

    return result.rows;
  }

  async findById(id: number) {
    await ensureSchema();
    const result = await pool.query(
      `SELECT ${COLUMNS}
       FROM messages
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    return result.rows[0] || null;
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string | null;
    message: string;
  }) {
    await ensureSchema();
    const result = await pool.query(
      `INSERT INTO messages (name, email, phone, message)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [data.name, data.email, data.phone ?? null, data.message],
    );

    return result.rows[0];
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    },
  ) {
    await ensureSchema();
    const result = await pool.query(
      `UPDATE messages
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           message = COALESCE($4, message),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND is_deleted = false
       RETURNING ${COLUMNS}`,
      [data.name, data.email, data.phone, data.message, id],
    );

    return result.rows[0] || null;
  }

  async delete(id: number) {
    await ensureSchema();
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
