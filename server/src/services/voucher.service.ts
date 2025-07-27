import { prisma } from "@/configs/prisma.config.js";
import { VoucherInput } from "@/validations/voucher.validation.js";

export class VoucherService {
  async createVoucher(data: VoucherInput) {
    const newVoucher = await prisma.voucher.create({
      data: {
        eventId: data.eventId,
        voucherCode: data.voucherCode,
        discountAmount: data.discountAmount,
        discountPercentage: data.discountPercentage,
        usageLimit: data.usageLimit,
        usedCount: data.usedCount,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
        status: data.status,
      },
    });
    return newVoucher;
  }
}
