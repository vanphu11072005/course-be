export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("refresh_tokens", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    token: { type: Sequelize.STRING(255), allowNull: false },
    expiresAt: { type: Sequelize.DATE, allowNull: false },
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

  await queryInterface.addIndex('refresh_tokens', ['token'], { name: 'idx_refresh_tokens_token' });
  await queryInterface.addIndex('refresh_tokens', ['userId'], { name: 'idx_refresh_tokens_userId' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("refresh_tokens");
}
