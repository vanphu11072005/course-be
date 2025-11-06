import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert("settings", [
    {
      id: uuidv4(),
      maintenanceMode: false,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("settings", null, {});
}
