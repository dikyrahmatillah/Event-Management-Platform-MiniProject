import express, { Application } from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import logger from "./utils/logger.js";
import authRouter from "@/routers/auth.router.js";
import eventRouter from "@/routers/event.router.js";
import ticketRouter from "@/routers/ticketType.router.js";
import voucherRouter from "@/routers/voucher.router.js";
import attendeeRouter from "@/routers/attendee.router.js";
import transactionRouter from "@/routers/transaction.router.js";
import pointRouter from "@/routers/point.router.js";
import couponRouter from "@/routers/coupon.router.js";

export class App {
  app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
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
    this.app.use("/api/v1/attendees", attendeeRouter);
    this.app.use("/api/v1/transactions", transactionRouter);
    this.app.use("/api/v1/points", pointRouter);
    this.app.use("/api/v1/coupons", couponRouter);
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
