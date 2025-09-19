import { Request, Response } from "express";
import { MessageService } from "@db/services/messageService";

export const MessageController = {
  async create(req: Request, res: Response) {
    try {
      const { creatorid, postid, description, status } = req.body;
      const messageData = { creatorid, postid, description, status };
      const message = await MessageService.create(messageData);
      res.status(201).json(message);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const messages = await MessageService.getAll();
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const message = await MessageService.getById(Number(req.params.id));
      res.json(message);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const message = await MessageService.update(Number(req.params.id), req.body);
      res.json(message);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const result = await MessageService.remove(Number(req.params.id));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
