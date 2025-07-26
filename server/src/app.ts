
import express, { Application } from "express";
import authRouter from "@/routers/auth.router.js";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";

export class App {
  app: Application;
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
    this.app.use(express.json());
  }

  setupMiddlewares() {
    this.app.use(cors({ origin: "http://localhost:3000" }));
    this.app.use(express.json());
  }
  setupRoutes() {
    this.app.use("/api/auth", authRouter);
  }

  setupErrorHandling() {
    this.app.use(errorMiddleware);
  }

  listen(port: string) {
    this.app.listen(port, () => {
      logger.info(`Server is listening on port: ${port}`);
    });
  }
}

export const app = new App();
