import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  await queryInterface.bulkInsert("roles", [
    { id: uuidv4(), name: "admin", createdAt: now, updatedAt: now },
    { id: uuidv4(), name: "instructor", createdAt: now, updatedAt: now },
    { id: uuidv4(), name: "student", createdAt: now, updatedAt: now },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("roles", null, {});
}
