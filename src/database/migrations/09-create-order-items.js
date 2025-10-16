export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("order_items", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    orderId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "orders", key: "id" },
      onDelete: "CASCADE",
    },

    courseId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "courses", key: "id" },
      onDelete: "CASCADE",
    },

    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    discount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    finalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    accessStatus: {
      type: Sequelize.ENUM("active", "expired", "revoked"),
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
  await queryInterface.dropTable("order_items");
}
