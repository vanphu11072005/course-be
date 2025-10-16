import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class RefreshToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "user", });
    }
  }

  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      token: { type: DataTypes.STRING, allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "refresh_tokens",
      timestamps: true,
    }
  );

  return RefreshToken;
};
