import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      this.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      orderId: { type: DataTypes.UUID, allowNull: false },
      paymentMethod: {
        type: DataTypes.ENUM("credit_card", "paypal", "bank", "momo", "zalopay"),
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      paidAt: { type: DataTypes.DATE, allowNull: true },
      meta: { type: DataTypes.JSON, allowNull: true },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      timestamps: true,
    }
  );

  return Payment;
};
