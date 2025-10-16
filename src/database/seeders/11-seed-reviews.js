import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  const now = new Date();
  const users = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE roleId IN (SELECT id FROM roles WHERE name='student')`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );
  const courses = await queryInterface.sequelize.query(
    `SELECT id FROM courses`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const reviews = [];

  for (const course of courses) {
    const reviewCount = faker.number.int({ min: 0, max: 5 });
    const reviewers = faker.helpers.arrayElements(users, reviewCount);
    for (const user of reviewers) {
      reviews.push({
        id: uuidv4(),
        userId: user.id,
        courseId: course.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentences(2),
        status: faker.helpers.arrayElement(["pending", "approved", "rejected"]),
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await queryInterface.bulkInsert("reviews", reviews, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("reviews", null, {});
}
