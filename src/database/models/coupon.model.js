import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Coupon extends Model {
    static associate(models) {
      this.hasMany(models.Order, { foreignKey: "couponId", as: "orders" });
    }
  }

  Coupon.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: { 
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      discountType: { 
        type: DataTypes.ENUM("percentage", "fixed"),
        allowNull: false,
      },
      value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      usageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      maxUsage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      validFrom: { type: DataTypes.DATE, allowNull: true },
      validTo: { type: DataTypes.DATE, allowNull: true },
      minOrderValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Coupon",
      tableName: "coupons",
      timestamps: true,
    }
  );

  return Coupon;
};
