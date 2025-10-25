import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  const now = new Date();
  const password = await bcrypt.hash("123456", 10);

  // map role Lấy roleId từ roles đã seed
  const roles = await queryInterface.sequelize.query(
    `SELECT id, name FROM roles`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const adminRoleId = roles.find((r) => r.name === "admin").id;
  const instructorRoleId = roles.find((r) => r.name === "instructor").id;
  const studentRoleId = roles.find((r) => r.name === "student").id;

  const users = [];
  const profiles = [];

  // 1. Admin
  const adminId = uuidv4();
  users.push({
    id: adminId,
    name: "Admin",
    email: "admin@course.com",
    passwordHash: password,
    roleId: adminRoleId,
    avatarUrl: null,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
  profiles.push({
    id: uuidv4(),
    userId: adminId,
    fullName: "Admin User",
    phone: faker.string.numeric(10),
    address: "123 Admin Street",
    dateOfBirth: "2000-01-01",
    createdAt: now,
    updatedAt: now,
  });

  // 2. Instructor
  for (let i = 0; i < 2; i++) {
    const id = uuidv4();
    const fullName = faker.person.fullName();
    users.push({
      id,
      name: fullName,
      email: faker.internet.email(),
      passwordHash: password,
      roleId: instructorRoleId,
      avatarUrl: null,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    profiles.push({
      id: uuidv4(),
      userId: id,
      fullName,
      phone: faker.string.numeric(10),
      address: faker.location.streetAddress(),
      dateOfBirth: faker.date.birthdate({ min: 25, max: 50, mode: "age" }),
      createdAt: now,
      updatedAt: now,
    });
  }

  // 3. Student
  for (let i = 0; i < 7; i++) {
    const id = uuidv4();
    const fullName = faker.person.fullName();
    users.push({
      id,
      name: fullName,
      email: faker.internet.email(),
      passwordHash: password,
      roleId: studentRoleId,
      avatarUrl: null,
      status: faker.helpers.arrayElement(["active", "inactive"]),
      createdAt: now,
      updatedAt: now,
    });
    profiles.push({
      id: uuidv4(),
      userId: id,
      fullName,
      phone: faker.string.numeric(10),
      address: faker.location.streetAddress(),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 40, mode: "age" }),
      createdAt: now,
      updatedAt: now,
    });
  }

  await queryInterface.bulkInsert("users", users, {});
  await queryInterface.bulkInsert("profiles", profiles, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("profiles", null, {});
  await queryInterface.bulkDelete("users", null, {});
}
