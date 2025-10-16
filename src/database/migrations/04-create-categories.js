export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("categories", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: Sequelize.STRING(150), allowNull: false },
    slug: {
      type: Sequelize.STRING(150),
      allowNull: false,
      unique: true
    },
    description: { type: Sequelize.TEXT, allowNull: true, },
    status: {
      type: Sequelize.ENUM("active", "hidden"),
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("categories");
}
