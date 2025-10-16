import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Review extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
    }
  }

  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      courseId: { type: DataTypes.UUID, allowNull: false },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
      timestamps: true,
    }
  );

  return Review;
};
