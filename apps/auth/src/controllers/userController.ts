import type { Request, Response } from "express";
import { UserService } from "@db/services/userService";
import { sendWelcomeEmail } from "../../../../packages/utils/email";

export const UserController = {
  async register(req: Request, res: Response) {
    try {
      const success = await UserService.register(req.body);
      if (!success) {
        return res.status(409).json({ error: "El RUT o correo ya está registrado" });
      }
      await sendWelcomeEmail(req.body.email, req.body.nombre);
      res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
