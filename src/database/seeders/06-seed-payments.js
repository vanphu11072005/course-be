import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  // Lấy orders đã tạo từ DB
  const orders = await queryInterface.sequelize.query(
    `SELECT id, totalAmount, status FROM orders`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  const payments = [];

  orders.forEach((order) => {
    if (order.status === "paid") {
      payments.push({
        id: uuidv4(),
        orderId: order.id,
        paymentMethod: faker.helpers.arrayElement([
          "credit_card",
          "paypal",
          "bank",
          "momo",
          "zalopay",
        ]),
        transactionId: uuidv4(),
        amount: order.totalAmount,
        status: "success",
        paidAt: faker.date.recent(),
        meta: JSON.stringify({
          note: "Payment processed automatically in seed",
          gateway: "AutoSeed",
        }),
        createdAt: now,
        updatedAt: now,
      });
    } else if (order.status === "pending") {
      payments.push({
        id: uuidv4(),
        orderId: order.id,
        paymentMethod: faker.helpers.arrayElement([
          "credit_card",
          "paypal",
          "bank",
          "momo",
          "zalopay",
        ]),
        transactionId: null,
        amount: 0,
        status: "pending",
        paidAt: null,
        meta: JSON.stringify({
          note: "Pending payment - not completed yet",
        }),
        createdAt: now,
        updatedAt: now,
      });
    }
  });

  await queryInterface.bulkInsert("payments", payments, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("payments", null, {});
}
