import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Profile extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  Profile.init(
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
        unique: true,
      },
      fullName: { type: DataTypes.STRING(100) },
      phone: { type: DataTypes.STRING(20) },
      address: { type: DataTypes.STRING(255) },
      dateOfBirth: { type: DataTypes.DATEONLY },
    },

    {
      sequelize,
      modelName: "Profile",
      tableName: "profiles",
      timestamps: true,
    }
  );

  return Profile;
};
