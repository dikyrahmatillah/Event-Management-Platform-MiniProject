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
        firstName: faker.person.firstName().slice(0, 100),
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
        firstName: faker.person.firstName().slice(0, 100),
        lastName: faker.person.lastName().slice(0, 100),
        phone: faker.phone.number().slice(0, 20),
        role: "CUSTOMER",
        profilePicture: faker.image.avatar(),
        referralCode: generateReferralCode(),
        referredBy: null,
      },
    });
    users.push(customer1);
    customers.push(customer1);
    console.log(`✅ Created customer 1:`, customer1.email);

    for (let i = 2; i <= 10; i++) {
      const customer = await prisma.user.create({
        data: {
          email: `customer${i}@example.com`,
          password: hashedPassword,
          firstName: faker.person.firstName().slice(0, 100),
          lastName: faker.person.lastName().slice(0, 100),
          phone: faker.phone.number().slice(0, 20),
          role: "CUSTOMER",
          profilePicture: faker.image.avatar(),
          referralCode: generateReferralCode(),
          referredBy: customer1.id,
        },
      });
      users.push(customer);
      customers.push(customer);
      console.log(`✅ Created customer ${i}:`, customer.email);

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

    const eventStatuses = ["ACTIVE", "INACTIVE", "CANCELLED"] as const;
    const events = [];

    for (let i = 0; i < 10; i++) {
      const status = eventStatuses[i % eventStatuses.length];
      const eventPrices = [50000, 100000, 150000, 200000];
      const seats = faker.helpers.arrayElement([50, 100, 200, 500]);
      const event = await prisma.event.create({
        data: {
          organizerId: organizer.id,
          eventName: `Event ${i + 1} (${status})`,
          description: faker.lorem.paragraph(),
          category: faker.commerce.department(),
          location: faker.location.city(),
          price: faker.helpers.arrayElement(eventPrices),
          startDate: faker.date.future(),
          endDate: faker.date.future(),
          totalSeats: seats,
          availableSeats: seats,
          imageUrl: faker.image.urlPicsumPhotos(),
          status,
        },
      });
      events.push(event);
      console.log(`✅ Created event: ${event.eventName} [${status}]`);

      const ticketTypes = [];
      for (let j = 0; j < 5; j++) {
        const ticketPrices = [50000, 100000, 200000];
        const ticketType = await prisma.ticketType.create({
          data: {
            eventId: event.id,
            typeName: `Ticket ${j + 1} for Event ${i + 1}`,
            description: faker.lorem.sentence(),
            price: faker.helpers.arrayElement(ticketPrices),
            quantity: faker.number.int({ min: 20, max: 100 }),
            availableQuantity: faker.number.int({ min: 0, max: 10 }),
          },
        });
        ticketTypes.push(ticketType);
        console.log(`🎟️  Ticket ${j + 1} for Event ${i + 1} created`);
      }

      const transactionStatuses = [
        "WAITING_PAYMENT",
        "WAITING_CONFIRMATION",
        "DONE",
        "REJECTED",
        "EXPIRED",
        "CANCELLED",
      ] as const;

      for (let k = 0; k < ticketTypes.length; k++) {
        const ticketType = ticketTypes[k];
        for (let t = 0; t < 5; t++) {
          const transactionStatus =
            transactionStatuses[(i + k + t) % transactionStatuses.length];
          const customer = customers[(i + k + t) % customers.length];
          const quantity = faker.number.int({ min: 1, max: 3 });
          const subtotal = Number(ticketType.price) * quantity;

          const transaction = await prisma.transaction.create({
            data: {
              userId: customer.id,
              eventId: event.id,
              transactionCode: faker.string.alphanumeric(10).toUpperCase(),
              quantity,
              subtotal,
              discountAmount: 0,
              pointsUsed: 0,
              finalAmount: subtotal,
              status: transactionStatus,
              paymentProof: null,
              paymentDeadline: faker.date.future(),
            },
          });

          await prisma.transactionDetail.create({
            data: {
              transactionId: transaction.id,
              ticketTypeId: ticketType.id,
              quantity,
              unitPrice: ticketType.price,
              totalPrice: subtotal,
            },
          });

          console.log(
            `🧾 Transaction for ${customer.email} on ${event.eventName} [${transactionStatus}]`
          );
        }
      }
    }

    const allTransactions = await prisma.transaction.findMany();
    const allEvents = await prisma.event.findMany();
    let attendeeCount = 0;
    for (const user of users) {
      const numAttendees = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < numAttendees; i++) {
        const userTransactions = allTransactions.filter(
          (t) => t.userId === user.id
        );
        if (userTransactions.length === 0) continue;
        const transaction = faker.helpers.arrayElement(userTransactions);
        const event = faker.helpers.arrayElement(allEvents);
        await prisma.attendee.create({
          data: {
            transactionId: transaction.id,
            userId: user.id,
            eventId: event.id,
            attendedAt: faker.datatype.boolean() ? faker.date.past() : null,
            status: faker.helpers.arrayElement([
              "REGISTERED",
              "ATTENDED",
              "NO_SHOW",
            ]),
            createdAt: faker.date.past(),
          },
        });
        attendeeCount++;
      }
    }
    console.log(`✅ Created ${attendeeCount} attendees for users`);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Total users created: ${users.length}`);
    console.log("🔑 All users have password: pass123");

    const counts = await Promise.all([
      prisma.user.count(),
      prisma.coupon.count(),
      prisma.point.count(),
      prisma.event.count(),
      prisma.ticketType.count(),
      prisma.transaction.count(),
      prisma.attendee.count(),
    ]);

    console.log("\n📊 Final Summary:");
    console.log(`Users: ${counts[0]}`);
    console.log(`Coupons: ${counts[1]}`);
    console.log(`Points: ${counts[2]}`);
    console.log(`Events: ${counts[3]}`);
    console.log(`Ticket Types: ${counts[4]}`);
    console.log(`Transactions: ${counts[5]}`);
    console.log(`Attendees: ${counts[6]}`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
