export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("profiles", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    fullName: { type: Sequelize.STRING(100), allowNull: true },
    phone: { type: Sequelize.STRING(20), allowNull: true },
    address: { type: Sequelize.STRING(255), allowNull: true },
    dateOfBirth: { type: Sequelize.DATEONLY, allowNull: true },
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
  await queryInterface.dropTable("profiles");
}
