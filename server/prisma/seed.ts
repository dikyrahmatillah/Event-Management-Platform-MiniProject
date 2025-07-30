import { faker } from "@faker-js/faker";
import { PrismaClient } from "@/generated/prisma/index.js";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

function generateReferralCode(): string {
  return faker.string.alphanumeric(8).toUpperCase();
}

function generateUniqueCode(prefix: string, length: number = 8): string {
  return prefix + faker.string.alphanumeric(length).toUpperCase();
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    await prisma.pointTransaction.deleteMany();
    await prisma.attendee.deleteMany();
    await prisma.transactionCoupon.deleteMany();
    await prisma.transactionVoucher.deleteMany();
    await prisma.transactionDetail.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.point.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.voucher.deleteMany();
    await prisma.ticketType.deleteMany();
    await prisma.review.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    console.log("🧹 Cleared all existing data");

    const hashedPassword = await hash("Pass123!", 10);
    const users = [];

    const organizer = await prisma.user.create({
      data: {
        email: "organizer@example.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Organizer",
        phone: "+1234567890",
        role: "ORGANIZER",
        profilePicture: faker.image.avatar(),
        referralCode: generateReferralCode(),
      },
    });
    users.push(organizer);
    console.log("✅ Created organizer:", organizer.email);

    const customers: any[] = [];

    const customer1 = await prisma.user.create({
      data: {
        email: `customer1@example.com`,
        password: hashedPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        role: "CUSTOMER",
        profilePicture: faker.image.avatar(),
        referralCode: generateReferralCode(),
        referredBy: null,
      },
    });
    users.push(customer1);
    customers.push(customer1);
    console.log(`✅ Created customer 1:`, customer1.email);

    for (let i = 2; i <= 4; i++) {
      const customer = await prisma.user.create({
        data: {
          email: `customer${i}@example.com`,
          password: hashedPassword,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phone: faker.phone.number(),
          role: "CUSTOMER",
          profilePicture: faker.image.avatar(),
          referralCode: generateReferralCode(),
          referredBy: customer1.id,
        },
      });
      users.push(customer);
      customers.push(customer);
      console.log(`✅ Created customer ${i}:`, customer.email);

      // Referral bonus/coupon for referred customers
      const now = new Date();
      const expiresIn3Months = addMonths(now, 3);
      const referralBonus = 10_000;

      await prisma.coupon.create({
        data: {
          userId: customer.id,
          couponCode: generateUniqueCode("REFERRAL", 6),
          discountAmount: referralBonus,
          discountPercentage: 0,
          validFrom: now,
          validUntil: expiresIn3Months,
          status: "ACTIVE",
        },
      });

      await prisma.point.create({
        data: {
          userId: customer1.id,
          pointsEarned: referralBonus,
          pointsUsed: 0,
          balance: referralBonus,
          description: "Referral bonus",
          expiresAt: expiresIn3Months,
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Total users created: ${users.length}`);
    console.log("🔑 All users have password: pass123");

    const counts = await Promise.all([
      prisma.user.count(),
      prisma.coupon.count(),
      prisma.point.count(),
    ]);

    console.log("\n📊 Final Summary:");
    console.log(`Users: ${counts[0]}`);
    console.log(`Coupons: ${counts[1]}`);
    console.log(`Points: ${counts[2]}`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
