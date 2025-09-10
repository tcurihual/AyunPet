import { Request, Response } from "express";
import { AdoptionRequestService } from "@db/services/adoptionRequestService";

export const AdoptionRequestController = {
  async create(req: Request, res: Response) {
    try {
      const { postid, userid, message, status } = req.body;
      const requestData = { postid, userid, message, status };
      const adoptionRequest = await AdoptionRequestService.create(requestData);
      res.status(201).json(adoptionRequest);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const adoptionRequests = await AdoptionRequestService.getAll();
      res.json(adoptionRequests);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const adoptionRequest = await AdoptionRequestService.getById(Number(req.params.id));
      res.json(adoptionRequest);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async getByUser(req: Request, res: Response) {
    try {
      const adoptionRequests = await AdoptionRequestService.getByUser(Number(req.params.userid));
      res.json(adoptionRequests);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByPost(req: Request, res: Response) {
    try {
      const adoptionRequests = await AdoptionRequestService.getByPost(Number(req.params.postid));
      res.json(adoptionRequests);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const adoptionRequest = await AdoptionRequestService.update(Number(req.params.id), req.body);
      res.json(adoptionRequest);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const result = await AdoptionRequestService.remove(Number(req.params.id));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
