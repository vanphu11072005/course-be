import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Role extends Model {
    static associate(models) {
      this.hasMany(models.User, { foreignKey: "roleId", as: "users" });
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    { 
      sequelize,
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
