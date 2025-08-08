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

function generateIndonesianPhoneNumber(): string {
  const number = faker.string.numeric(faker.number.int({ min: 9, max: 10 }));
  return `+628${number}`;
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
        phone: generateIndonesianPhoneNumber(),
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
        phone: generateIndonesianPhoneNumber(),
        role: "CUSTOMER",
        profilePicture: faker.image.avatar(),
        referralCode: generateReferralCode(),
        referredBy: null,
      },
    });
    users.push(customer1);
    customers.push(customer1);
    console.log(`✅ Created customer 1:`, customer1.email);

    for (let i = 2; i <= 5; i++) {
      const customer = await prisma.user.create({
        data: {
          email: `customer${i}@example.com`,
          password: hashedPassword,
          firstName: faker.person.firstName().slice(0, 100),
          lastName: faker.person.lastName().slice(0, 100),
          phone: generateIndonesianPhoneNumber(),
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

    // const eventStatuses = ["ACTIVE", "INACTIVE", "CANCELLED"] as const;
    const eventStatuses = "ACTIVE" as const;
    const events = [];

    for (let i = 0; i < 5; i++) {
      // const status = eventStatuses[i % eventStatuses.length];
      const status = eventStatuses;
      const eventPrices = [50000, 100000, 150000, 200000];
      const ticketTypesName = [
        "Regular",
        "VIP",
        "Early Bird",
        "Group",
        "Student",
      ];
      const ticketPrices = [50000, 100000, 200000];
      // Prepare ticketType data and sum total seats
      const ticketTypeData = ticketTypesName.map((name) => {
        const qty = 50;
        return {
          typeName: name,
          description: faker.lorem.sentence(),
          price: faker.helpers.arrayElement(ticketPrices),
          quantity: qty,
          availableQuantity: qty,
        };
      });
      const totalSeats = ticketTypeData.reduce((sum, t) => sum + t.quantity, 0);
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
          totalSeats: totalSeats,
          availableSeats: totalSeats, // will update after transactions
          imageUrl: faker.image.urlPicsumPhotos(),
          status,
        },
      });
      // Create ticketTypes with eventId
      const ticketTypes = [];
      for (let j = 0; j < ticketTypeData.length; j++) {
        const ticketType = await prisma.ticketType.create({
          data: {
            ...ticketTypeData[j],
            eventId: event.id,
          },
        });
        ticketTypes.push(ticketType);
        console.log(`🎟️  Ticket ${j + 1} for Event ${i + 1} created`);
      }
      events.push(event);
      console.log(`✅ Created event: ${event.eventName} [${status}]`);

      const transactionStatuses = [
        "WAITING_PAYMENT",
        "WAITING_CONFIRMATION",
        "DONE",
        "REJECTED",
        "EXPIRED",
        "CANCELLED",
      ] as const;

      for (let k = 0; k < ticketTypes.length; k++) {
        let ticketType = ticketTypes[k];
        let available = ticketType.availableQuantity;
        for (let t = 0; t < 5; t++) {
          if (available <= 0) break;
          const transactionStatus =
            transactionStatuses[(i + k + t) % transactionStatuses.length];
          const customer = customers[(i + k + t) % customers.length];
          let quantity = faker.number.int({ min: 1, max: 3 });
          if (quantity > available) quantity = available;
          if (quantity <= 0) continue;
          const subtotal = Number(ticketType.price) * quantity;

          // Generate realistic createdAt/paymentDeadline/updatedAt for DONE transactions
          let createdAt = new Date();
          let updatedAt = createdAt;
          let paymentDeadline = faker.date.future();
          if (transactionStatus === "DONE") {
            const now = new Date();
            const randomType = faker.number.int({ min: 1, max: 3 });
            if (randomType === 1) {
              // Today
              createdAt = faker.date.between({
                from: new Date(now.setHours(0, 0, 0, 0)),
                to: new Date(),
              });
            } else if (randomType === 2) {
              // This month
              const startOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
              );
              createdAt = faker.date.between({
                from: startOfMonth,
                to: new Date(),
              });
            } else {
              // Last 6 months
              const sixMonthsAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 6,
                now.getDate()
              );
              createdAt = faker.date.between({
                from: sixMonthsAgo,
                to: new Date(),
              });
            }
            updatedAt = createdAt;
            paymentDeadline = faker.date.soon({ days: 3, refDate: createdAt });
          }

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
              paymentDeadline,
              createdAt,
              updatedAt,
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

          // Decrement available quantity for this ticket type
          available -= quantity;
          await prisma.ticketType.update({
            where: { id: ticketType.id },
            data: { availableQuantity: available },
          });

          // Log transaction
          console.log(
            `🧾 Transaction for ${customer.email} on ${event.eventName} [${transactionStatus}] (qty: ${quantity}, remaining: ${available})`
          );
        }
      }

      // --- Special transactions for customer1 (points) and customer2 (coupon) ---
      // Only run for the first event/ticketType for demo
      if (i === 0 && ticketTypes.length > 0) {
        const ticketType = ticketTypes[0];
        // Customer1 uses points
        const customer1Points = await prisma.point.findFirst({
          where: { userId: customers[0].id },
        });
        const pointsToUse = customer1Points
          ? Math.min(customer1Points.balance, Number(ticketType.price))
          : 0;
        if (pointsToUse > 0) {
          const subtotal = Number(ticketType.price);
          const finalAmount = subtotal - pointsToUse;
          const specialTx = await prisma.transaction.create({
            data: {
              userId: customers[0].id,
              eventId: event.id,
              transactionCode: generateUniqueCode("POINTS", 6),
              quantity: 1,
              subtotal,
              discountAmount: pointsToUse,
              pointsUsed: pointsToUse,
              finalAmount: finalAmount < 0 ? 0 : finalAmount,
              status: "WAITING_CONFIRMATION",
              paymentProof: null,
              paymentDeadline: faker.date.soon({ days: 3 }),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          await prisma.transactionDetail.create({
            data: {
              transactionId: specialTx.id,
              ticketTypeId: ticketType.id,
              quantity: 1,
              unitPrice: ticketType.price,
              totalPrice: subtotal,
            },
          });
          // Deduct points
          if (customer1Points) {
            await prisma.point.update({
              where: { id: customer1Points.id },
              data: {
                pointsUsed: pointsToUse,
                balance: customer1Points.balance - pointsToUse,
              },
            });
          }
          // Log
          console.log(
            `⭐ Special transaction for customer1 using points: -${pointsToUse} points`
          );
        }

        // Customer2 uses coupon
        const customer2Coupon = await prisma.coupon.findFirst({
          where: { userId: customers[1].id, status: "ACTIVE" },
        });
        if (customer2Coupon) {
          const subtotal = Number(ticketType.price);
          const discount = Number(customer2Coupon.discountAmount) || 0;
          const finalAmount = subtotal - discount;
          const specialTx = await prisma.transaction.create({
            data: {
              userId: customers[1].id,
              eventId: event.id,
              transactionCode: generateUniqueCode("COUPON", 6),
              quantity: 1,
              subtotal,
              discountAmount: discount,
              pointsUsed: 0,
              finalAmount: finalAmount < 0 ? 0 : finalAmount,
              status: "WAITING_CONFIRMATION",
              paymentProof: null,
              paymentDeadline: faker.date.soon({ days: 3 }),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          await prisma.transactionDetail.create({
            data: {
              transactionId: specialTx.id,
              ticketTypeId: ticketType.id,
              quantity: 1,
              unitPrice: ticketType.price,
              totalPrice: subtotal,
            },
          });
          // Mark coupon as used
          await prisma.coupon.update({
            where: { id: customer2Coupon.id },
            data: { status: "USED" },
          });
          // Link coupon to transaction
          await prisma.transactionCoupon.create({
            data: {
              transactionId: specialTx.id,
              couponId: customer2Coupon.id,
              discountApplied: discount,
            },
          });
          // Log
          console.log(
            `🎫 Special transaction for customer2 using coupon: -${discount} coupon`
          );
        }
      }
      const updatedTicketTypes = await prisma.ticketType.findMany({
        where: { eventId: event.id },
      });
      const updatedAvailableSeats = updatedTicketTypes.reduce(
        (sum, t) => sum + t.availableQuantity,
        0
      );
      await prisma.event.update({
        where: { id: event.id },
        data: { availableSeats: updatedAvailableSeats },
      });
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
