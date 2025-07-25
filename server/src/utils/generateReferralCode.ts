import { prisma } from "@/configs/prisma.config.js";

export async function generateReferralCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code: string;
  let exists: object | null = null;
  do {
    code = Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    exists = await prisma.user.findUnique({ where: { referralCode: code } });
  } while (exists !== null);
  return code;
}
