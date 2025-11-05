import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, AUTH_PORT } from "@repo/utils";
import authRouter from "./routes"; // Cambiado de "./routs" 
import passwordRoutes from "./routes/passwordRoutes";
import emailVerificationRoutes from "./routes/emailVerificationRoutes";
import userRoutes from "./routes/registerRoute";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  return res.status(200).json({
    message: "Microservicio Auth funcionando correctamente",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      users: "/api/auth/users",
      password: "/api/auth (password routes)",
      email: "/api/auth (email verification routes)"
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/auth", passwordRoutes);
app.use("/api/auth", emailVerificationRoutes);
app.use("/api/auth/users", userRoutes);

app.use(errorHandler);

app.listen(AUTH_PORT, () => {
  console.log(`🚀 Auth service running on http://localhost:${AUTH_PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /                        - Service health check`);
  console.log(`   POST /api/auth/login          - User login`);
  console.log(`   POST /api/auth/logout         - User logout`);
  console.log(`   POST /api/auth/users/register - User registration`);
  console.log(`   GET  /api/auth/users/health   - Users service health`);
});