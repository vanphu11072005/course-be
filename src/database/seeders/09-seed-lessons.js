import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  const now = new Date();

  const courses = await queryInterface.sequelize.query(
    `SELECT id FROM courses`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const lessons = [];

  for (const course of courses) {
    const lessonCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < lessonCount; i++) {
      lessons.push({
        id: uuidv4(),
        courseId: course.id,
        title: `Lesson ${i + 1}: ${faker.lorem.sentence()}`,
        content: faker.lorem.paragraphs(2),
        videoUrl: faker.internet.url(),
        resourceUrls: JSON.stringify([faker.internet.url(), faker.internet.url()]),
        duration: faker.number.int({ min: 300, max: 1800 }),
        position: i + 1,
        isFreePreview: faker.datatype.boolean(),
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await queryInterface.bulkInsert("lessons", lessons, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("lessons", null, {});
}
