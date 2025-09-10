import { Request, Response } from "express";
import { PostService } from "@db/services/postService";

export const PostController = {
  async create(req: Request, res: Response) {
    try {
      const { creatorId, petId, title, description, status } = req.body;
      const postData = {
        creatorid: creatorId,
        petid: petId,
        title,
        description,
        status,
      };
      const post = await PostService.create(postData);
      res.status(201).json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const posts = await PostService.getAll();
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const post = await PostService.getById(Number(req.params.id));
      res.json(post);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const post = await PostService.update(Number(req.params.id), req.body);
      res.json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const result = await PostService.remove(Number(req.params.id));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};