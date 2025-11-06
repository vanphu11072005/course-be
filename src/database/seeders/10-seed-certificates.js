import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  const now = new Date();

  const enrollments = await queryInterface.sequelize.query(
    `SELECT id, userId, courseId FROM enrollments`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const certificates = [];

  for (const enrollment of enrollments) {
    if (faker.datatype.boolean()) {
      certificates.push({
        id: uuidv4(),
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        certificateUrl: faker.internet.url(),
        issuedAt: faker.date.recent(),
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await queryInterface.bulkInsert("certificates", certificates, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("certificates", null, {});
}
