import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Lesson extends Model {
    static associate(models) {
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
    }
  }

  Lesson.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      courseId: { type: DataTypes.UUID, allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      videoUrl: { type: DataTypes.STRING(500), allowNull: true },
      resourceUrls: { type: DataTypes.JSON, allowNull: true },
      duration: { type: DataTypes.INTEGER, allowNull: true },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isFreePreview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize, // truyền kết nối
      modelName: "Lesson",
      tableName: "lessons",
      timestamps: true,
    }
  );

  return Lesson;
};
