import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Category extends Model {
    static associate(models) {
      this.hasMany(models.Course, { foreignKey: "categoryId", as: "courses" });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING(150), allowNull: false },
      slug: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM("active", "hidden"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      timestamps: true,
     }
  );

  return Category;
};
