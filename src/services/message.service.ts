/**
 * Message Service
 * Contains business logic for message operations
 */

import { messageRepository } from "../repositories/message.repository.js";
import { sendContactNotification } from "../utils/mail.js";

export class MessageService {
  async getAllMessages() {
    const messages = await messageRepository.findAll();
    return messages.map((message) => this.formatMessageResponse(message));
  }

  async getMessageById(id: number) {
    const message = await messageRepository.findById(id);
    if (!message) {
      throw new Error("Message not found");
    }

    return this.formatMessageResponse(message);
  }

  async createMessage(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    if (!data.name || !data.email || !data.message) {
      throw new Error("Name, email, and message are required");
    }

    const phone = typeof data.phone === "string" ? data.phone.trim() : "";
    if (phone && !/^\+?[\d\s-]{7,20}$/.test(phone)) {
      throw new Error("Phone number is invalid");
    }

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: phone || undefined,
      message: data.message.trim(),
    };

    const created = await messageRepository.create(payload);

    // Notify inbox; do not fail the request if mail delivery has a temporary issue.
    void sendContactNotification(payload).catch((error: unknown) => {
      console.error("Failed to send contact notification email", error);
    });

    return this.formatMessageResponse(created);
  }

  async updateMessage(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    },
  ) {
    const existing = await messageRepository.findById(id);
    if (!existing) {
      throw new Error("Message not found");
    }

    const updated = await messageRepository.update(id, {
      name: data.name?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      message: data.message?.trim(),
    });

    if (!updated) {
      throw new Error("Failed to update message");
    }

    return this.formatMessageResponse(updated);
  }

  async deleteMessage(id: number) {
    const existing = await messageRepository.findById(id);
    if (!existing) {
      throw new Error("Message not found");
    }

    const deleted = await messageRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete message");
    }

    return { message: "Message deleted successfully" };
  }

  private formatMessageResponse(message: any) {
    return {
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone ?? null,
      message: message.message,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    };
  }
}

export const messageService = new MessageService();
