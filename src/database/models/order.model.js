import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      this.belongsTo(models.Coupon, { foreignKey: "couponId", as: "coupon" });
      this.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" });
      this.hasMany(models.Payment, { foreignKey: "orderId", as: "payments" });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      couponId: { type: DataTypes.UUID, allowNull: true },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.ENUM("pending", "paid", "cancelled", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentMethod: {
        type: DataTypes.ENUM("credit_card", "paypal", "bank", "momo", "zalopay"),
        allowNull: true,
      },
      paymentStatus: {
        type: DataTypes.ENUM("unpaid", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "unpaid",
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
    }
  );

  return Order;
};
