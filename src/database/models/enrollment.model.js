import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Enrollment extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      this.belongsTo(models.OrderItem, { foreignKey: "orderItemId", as: "orderItem" });
    }
  }

  Enrollment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "courses", key: "id" },
        onDelete: "CASCADE",
      },
      orderItemId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "order_items", key: "id" },
        onDelete: "SET NULL",
      },
      progress: { type: DataTypes.JSON, allowNull: true },
      startedAt: { type: DataTypes.DATE, allowNull: true },
      completedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize, // truyền kết nối
      modelName: "Enrollment",
      tableName: "enrollments",
      timestamps: true,
    }
  );

  return Enrollment;
};
