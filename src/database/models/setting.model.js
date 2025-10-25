import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Setting extends Model {
    static associate(models) {
      // Nếu sau này có liên kết gì thêm thì define ở đây
    }
  }

  Setting.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      maintenanceMode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Setting",
      tableName: "settings",
      timestamps: true,
    }
  );

  return Setting;
};
