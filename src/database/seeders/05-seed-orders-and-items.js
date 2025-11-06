import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  const users = await queryInterface.sequelize.query(
    `SELECT id FROM users`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  const courses = await queryInterface.sequelize.query(
    `SELECT id, price FROM courses`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  const coupons = await queryInterface.sequelize.query(
    `SELECT id FROM coupons`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  const orders = [];
  const orderItems = [];

  for (let i = 0; i < 15; i++) {
    const orderId = uuidv4();
    const user = faker.helpers.arrayElement(users);
    const coupon = faker.helpers.arrayElement([...coupons, null]);
    const couponId = coupon ? coupon.id : null;

    const status = faker.helpers.arrayElement([
      "pending",
      "paid",
      "cancelled",
      "refunded",
    ]);

    const paymentStatus =
      status === "paid"
        ? "paid"
        : status === "refunded"
        ? "refunded"
        : faker.helpers.arrayElement(["unpaid", "failed"]);

    const paymentMethod = faker.helpers.arrayElement([
      "credit_card",
      "paypal",
      "bank",
      "momo",
      "zalopay",
    ]);

    const note = faker.helpers.arrayElement([
      null,
      "Khách yêu cầu xuất hóa đơn.",
      "Thanh toán bị pending, chờ xác nhận.",
      "Sử dụng coupon giảm giá đặc biệt.",
    ]);

    let totalAmount = 0;

    // Mỗi đơn 1-3 khóa học, không trùng nhau
    const itemCount = faker.number.int({ min: 1, max: 3 });
    const selectedCourses = faker.helpers.arrayElements(courses, itemCount);

    selectedCourses.forEach((course) => {
      const price = Number(course.price);
      const discount =
        faker.number.int({ min: 0, max: 1 }) === 1
          ? Number((price * 0.1).toFixed(2))
          : 0; // Ngẫu nhiên giảm 10% hoặc không giảm
      const finalPrice = Number((price - discount).toFixed(2));
      totalAmount += finalPrice;

      const accessStatus = faker.helpers.arrayElement([
        "active",
        "expired",
        "revoked",
      ]);

      orderItems.push({
        id: uuidv4(),
        orderId,
        courseId: course.id,
        price,
        discount,
        finalPrice,
        accessStatus,
        createdAt: now,
        updatedAt: now,
      });
    });

    orders.push({
      id: orderId,
      userId: user.id,
      couponId,
      totalAmount: Number(totalAmount.toFixed(2)),
      status,
      paymentMethod,
      paymentStatus,
      note,
      createdAt: now,
      updatedAt: now,
    });
  }

  await queryInterface.bulkInsert("orders", orders, {});
  await queryInterface.bulkInsert("order_items", orderItems, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("order_items", null, {});
  await queryInterface.bulkDelete("orders", null, {});
}
