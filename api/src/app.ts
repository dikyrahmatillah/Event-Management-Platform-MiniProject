import express, { Application } from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import logger from "./utils/logger.js";
import authRouter from "@/routers/auth.router.js";
import eventRouter from "@/routers/event.router.js";
import ticketRouter from "@/routers/ticketType.router.js";
import voucherRouter from "@/routers/voucher.router.js";
<<<<<<< HEAD
=======
import attendeeRouter from "@/routers/attendee.router.js";
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139

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
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/events", eventRouter);
    this.app.use("/api/v1/tickets", ticketRouter);
    this.app.use("/api/v1/vouchers", voucherRouter);
<<<<<<< HEAD
=======
    this.app.use("/api/v1/attendees", attendeeRouter);
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
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
