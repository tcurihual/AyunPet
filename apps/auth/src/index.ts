import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { errorHandler, AUTH_PORT } from "@repo/utils"
import authRouter from "./routs"
import passwordRoutes from "./routes/passwordRoutes";
import emailVerificationRoutes from "./routes/emailVerificationRoutes";
import { loginController } from "./controllers/logincontroller"
import { logoutController } from "./controllers/logoutcontroller"
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
  });
});

// 👇 monta las rutas de usuario en la API
app.use("/api/auth/users", userRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/",authRouter)
app.use("/api/auth", emailVerificationRoutes);

app.use(errorHandler);

app.post("/", loginController)
app.post("/", logoutController)

app.use(errorHandler)
app.listen(AUTH_PORT, () => {
  console.log(`🚀 Auth service running on http://localhost:${AUTH_PORT}/api/auth`);
});
