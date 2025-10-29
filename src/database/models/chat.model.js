import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Chat extends Model {
    static associate(models) {
        Chat.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
        Chat.belongsTo(models.User, { as: "receiver", foreignKey: "receiverId" });
    }
  }

  Chat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      senderRole: {
        type: DataTypes.ENUM("user", "admin", "ai"),
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      receiverRole: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      timestamps: true,
    }
  );

  return Chat;
};
