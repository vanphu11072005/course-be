import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  // Lấy categories và instructors từ DB
  const categories = await queryInterface.sequelize.query(
    `SELECT id FROM categories`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  const instructors = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE roleId IN (SELECT id FROM roles WHERE name='instructor')`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  const courses = [];

  for (let i = 0; i < 10; i++) {
    const category = faker.helpers.arrayElement(categories);
    const instructor = faker.helpers.arrayElement(instructors);

    courses.push({
      id: uuidv4(),
      title: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
      description: faker.commerce.productDescription(),
      shortDescription: faker.lorem.sentence(),
      price: faker.number.int({ min: 100000, max: 2000000 }),
      status: faker.helpers.arrayElement(["draft", "published"]),
      thumbnailUrl: faker.image.url(),
      categoryId: category.id,
      instructorId: instructor.id,
      createdAt: now,
      updatedAt: now,
    });
  }

  await queryInterface.bulkInsert("courses", courses, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("courses", null, {});
}
