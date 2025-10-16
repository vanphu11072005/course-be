export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("certificates", {
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
    courseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "courses", key: "id" },
        onDelete: "CASCADE",
    },
    certificateUrl: { type: Sequelize.STRING(500), allowNull: false },
    issuedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("certificates");
}
