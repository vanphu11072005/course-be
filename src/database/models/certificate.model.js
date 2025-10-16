import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Certificate extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
    }
  }

  Certificate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      courseId: { type: DataTypes.UUID, allowNull: false },
      certificateUrl: { type: DataTypes.STRING(500), allowNull: false },
      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Certificate",
      tableName: "certificates",
      timestamps: true,
    }
  );

  return Certificate;
};
