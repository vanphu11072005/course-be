import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  const now = new Date();
  const coupons = [];

  for (let i = 0; i < 10; i++) {
    coupons.push({
      id: uuidv4(),
      code: uuidv4().slice(0, 8).toUpperCase(),
      description: faker.lorem.sentence(),
      discountType: faker.helpers.arrayElement(["percentage", "fixed"]),
      value: faker.number.int({ min: 5, max: 50 }),
      usageCount: 0,
      maxUsage: faker.number.int({ min: 1, max: 100 }),
      validFrom: faker.date.past(),
      validTo: faker.date.future(),
      minOrderValue: faker.number.int({ min: 0, max: 500000 }),
      status: faker.helpers.arrayElement(["active", "inactive", "expired"]),
      createdAt: now,
      updatedAt: now,
    });
  }

  await queryInterface.bulkInsert("coupons", coupons, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("coupons", null, {});
}
