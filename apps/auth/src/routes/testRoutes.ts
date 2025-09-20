import { Router } from "express";
import { sendPasswordResetEmail } from "../../../../packages/utils/email";

const router = Router();

router.post("/test-email", async (_, res) => {
  try {
    const testEmail = "hector2005.2017@gmail.com"; // tu correo real
    const testLink = "https://ayunpet.com/reset-password?token=TEST123";

    await sendPasswordResetEmail(testEmail, testLink);

    return res.status(200).json({ message: `Correo de prueba enviado a ${testEmail}` });
  } catch (err) {
    console.error("Error enviando correo de prueba:", err);
    return res.status(500).json({ error: "Error enviando correo" });
  }
});

export default router;
