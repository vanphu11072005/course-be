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

  const enrollments = [];

  for (const user of users) {
    const enrollCount = faker.number.int({ min: 1, max: 5 });
    const chosenCourses = faker.helpers.arrayElements(courses, enrollCount);
    for (const course of chosenCourses) {
      enrollments.push({
        id: uuidv4(),
        userId: user.id,
        courseId: course.id,
        orderItemId: null,
        progress: JSON.stringify({ completedLessons: [] }),
        startedAt: faker.date.past(1),
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await queryInterface.bulkInsert("enrollments", enrollments, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("enrollments", null, {});
}
