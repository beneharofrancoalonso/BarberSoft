import cors from "cors";
import express from "express";
import morgan from "morgan";
import appointmentsRouter from "./routes/appointments.js";
import authRouter from "./routes/auth.js";
import barbersRouter from "./routes/barbers.js";
import servicesRouter from "./routes/services.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/barbers", barbersRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/appointments", appointmentsRouter);

app.use(errorHandler);

export default app;
