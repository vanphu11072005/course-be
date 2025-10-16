import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class OrderItem extends Model {
    static associate(models) {
      this.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      orderId: { type: DataTypes.UUID, allowNull: false },
      courseId: { type: DataTypes.UUID, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      finalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      accessStatus: {
        type: DataTypes.ENUM("active", "expired", "revoked"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    { 
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
      timestamps: true,

       // Tự động tính finalPrice trước khi lưu
      hooks: {
        beforeValidate: (orderItem) => {
          const price = parseFloat(orderItem.price) || 0;
          const discount = parseFloat(orderItem.discount) || 0;
          orderItem.finalPrice = Math.max(price - discount, 0);
        },
      },
    }
  );

  return OrderItem;
};
