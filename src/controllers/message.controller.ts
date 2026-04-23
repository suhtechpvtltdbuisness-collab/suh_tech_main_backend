/**
 * Message Controller
 * Handles HTTP requests and responses for message operations
 */

import { Request, Response } from "express";
import { messageService } from "../services/message.service.js";

export class MessageController {
  async getAllMessages(req: Request, res: Response) {
    try {
      const messages = await messageService.getAllMessages();

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
      });
    }
  }

  async getMessageById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        });
      }

      const message = await messageService.getMessageById(id);

      res.json({
        success: true,
        data: message,
      });
    } catch (error: any) {
      console.error("Get message error:", error);

      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch message",
      });
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const payload = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
      };

      const message = await messageService.createMessage(payload);

      res.status(201).json({
        success: true,
        message: "Message created successfully",
        data: message,
      });
    } catch (error: any) {
      console.error("Create message error:", error);

      if (error.message.includes("required")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create message",
      });
    }
  }

  async updateMessage(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        });
      }

      const payload = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
      };

      const message = await messageService.updateMessage(id, payload);

      res.json({
        success: true,
        message: "Message updated successfully",
        data: message,
      });
    } catch (error: any) {
      console.error("Update message error:", error);

      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update message",
      });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        });
      }

      const result = await messageService.deleteMessage(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete message error:", error);

      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete message",
      });
    }
  }
}

export const messageController = new MessageController();
