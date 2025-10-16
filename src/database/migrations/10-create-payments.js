export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("payments", {
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

    paymentMethod: {
      type: Sequelize.ENUM("credit_card", "paypal", "bank", "momo", "zalopay"),
      allowNull: false,
    },

    transactionId: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },

    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    status: {
      type: Sequelize.ENUM("pending", "success", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },

    paidAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    meta: {
      type: Sequelize.JSON,
      allowNull: true,
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
  await queryInterface.dropTable("payments");
}
