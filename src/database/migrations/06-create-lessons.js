export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("lessons", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    courseId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "courses", key: "id" },
      onDelete: "CASCADE",
    },
    title: { type: Sequelize.STRING(255), allowNull: false },
    content: { type: Sequelize.TEXT, allowNull: true },
    videoUrl: { type: Sequelize.STRING(500), allowNull: true },
    resourceUrls: { type: Sequelize.JSON, allowNull: true },
    duration: { type: Sequelize.INTEGER, allowNull: true },
    position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    isFreePreview: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

  await queryInterface.addIndex('lessons', ['courseId', 'position'], { name: 'idx_lessons_courseId_position' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("lessons");
}
