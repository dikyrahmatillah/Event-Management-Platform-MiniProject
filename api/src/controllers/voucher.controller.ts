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
<<<<<<< HEAD
<<<<<<< HEAD
      response
        .status(201)
        .json({ message: "Voucher created successfully", voucher });
=======
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
      response.status(201).json({
        message: "Voucher created successfully",
        data: voucher,
      });
<<<<<<< HEAD
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };
}

export const voucherController = new VoucherController();
