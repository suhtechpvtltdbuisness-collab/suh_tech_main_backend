/**
 * Message Service
 * Contains business logic for message operations
 */

import { messageRepository } from "../repositories/message.repository.js";

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

  async createMessage(data: { name: string; email: string; message: string }) {
    if (!data.name || !data.email || !data.message) {
      throw new Error("Name, email, and message are required");
    }

    const created = await messageRepository.create({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    });

    return this.formatMessageResponse(created);
  }

  async updateMessage(
    id: number,
    data: {
      name?: string;
      email?: string;
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
      message: message.message,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    };
  }
}

export const messageService = new MessageService();
