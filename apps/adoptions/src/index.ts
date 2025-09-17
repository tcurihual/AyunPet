import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, ADOPTIONS_PORT } from "@repo/utils";
import postRoutes from "./routes/postRoutes";
import adoptionRequestRoutes from "./routes/adoptionRequestRoutes";
import messageRoutes from "./routes/messageRoutes";
import adopRouter from "./adoprouter";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  return res.status(200).json({
    message: "Microservicio Adoptions funcionando correctamente",
  });
});

app.use("/api/adoptions/posts", postRoutes);
app.use("/api/adoptions/adoption-request", adoptionRequestRoutes);
app.use("/api/adoptions/messages", messageRoutes);
app.use("/", adopRouter);

// middleware de errores al final
app.use(errorHandler);

app.listen(ADOPTIONS_PORT, () => {
  console.log(
    `🚀 Adoptions service running on http://localhost:${ADOPTIONS_PORT}`
  );
});
