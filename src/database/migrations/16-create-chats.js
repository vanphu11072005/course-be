export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("chats", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    senderId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    senderRole: {
      type: Sequelize.ENUM("user", "admin"),
      allowNull: false,
    },
    receiverId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
    },
    receiverRole: {
      type: Sequelize.ENUM("user", "admin"),
      allowNull: true,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });

  // Thêm index để tăng tốc query
  await queryInterface.addIndex("chats", ["senderId"]);
  await queryInterface.addIndex("chats", ["receiverId"]);
  await queryInterface.addIndex("chats", ["createdAt"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("chats");
}