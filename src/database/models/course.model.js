import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Course extends Model {
    static associate(models) {
      this.belongsTo(models.Category, { foreignKey: "categoryId", as: "category" });
      this.belongsTo(models.User, { foreignKey: "instructorId", as: "instructor" });
      this.hasMany(models.Lesson, { foreignKey: "courseId", as: "lessons" });
      this.hasMany(models.OrderItem, { foreignKey: "courseId", as: "orderItems" });
      this.hasMany(models.Enrollment, { foreignKey: "courseId", as: "enrollments" });
      this.hasMany(models.Review, { foreignKey: "courseId", as: "reviews" });
      this.hasMany(models.Certificate, { foreignKey: "courseId", as: "certificates" });
    }
  }

  Course.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      shortDescription: { type: DataTypes.STRING(512), allowNull: true },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },
      thumbnailUrl: { type: DataTypes.STRING(500), allowNull: false },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "categories", key: "id" },
      },
      instructorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
    },
    {
      sequelize, // truyền kết nối
      modelName: "Course", // tên model
      tableName: "courses",
      timestamps: true,
    }
  );

  return Course;
};
