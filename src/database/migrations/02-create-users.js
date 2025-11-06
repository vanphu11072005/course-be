export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: Sequelize.STRING(100), allowNull: false },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: { type: Sequelize.STRING(255), allowNull: false },
    roleId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "roles", key: "id" },
      onDelete: "RESTRICT",
    },
    avatarUrl: { type: Sequelize.STRING(500), allowNull: true },
    status: {
      type: Sequelize.ENUM("active", "inactive", "banned"),
      allowNull: false,
      defaultValue: "active",
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });

  await queryInterface.addIndex('users', ['roleId'], { name: 'idx_users_roleId' });
  await queryInterface.addIndex('users', ['status'], { name: 'idx_users_status' });
  await queryInterface.addIndex('users', ['status', 'createdAt'], { name: 'idx_users_status_createdAt' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
