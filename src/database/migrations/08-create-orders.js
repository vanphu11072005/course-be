export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("orders", {
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
    couponId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "coupons", key: "id" },
      onDelete: "SET NULL",
    },
    totalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: Sequelize.ENUM("pending", "paid", "cancelled", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentMethod: {
      type: Sequelize.ENUM("credit_card", "paypal", "bank", "momo", "zalopay"),
      allowNull: true,
    },
    paymentStatus: {
      type: Sequelize.ENUM("unpaid", "paid", "failed", "refunded"),
      allowNull: false,
      defaultValue: "unpaid",
    },
    note: {
      type: Sequelize.TEXT,
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

  await queryInterface.addIndex('orders', ['userId'], { name: 'idx_orders_userId' });
  await queryInterface.addIndex('orders', ['status', 'createdAt'], { name: 'idx_orders_status_createdAt' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("orders");
}
