import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser clients (curl, Postman) and configured origins.
      if (!origin || env.clientUrls.includes(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ success: true, message: "LMS API is running" }));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
