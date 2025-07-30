import { VoucherService } from "@/services/voucher.service.js";
import { NextFunction, Request, Response } from "express";

export class VoucherController {
  private voucherService = new VoucherService();

  createVoucher = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = request.params.eventId;
      if (!eventId)
        return response.status(400).json({ message: "Event ID is required" });

      const data = {
        ...request.body,
        eventId,
      };
      const voucher = await this.voucherService.createVoucher(data);
      response
        .status(201)
        .json({ message: "Voucher created successfully", voucher });
    } catch (error) {
      next(error);
    }
  };
}

export const voucherController = new VoucherController();
