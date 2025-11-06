export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("courses", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: { type: Sequelize.STRING(255), allowNull: false },
    slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    description: { type: Sequelize.TEXT, allowNull: true },
    shortDescription: { type: Sequelize.STRING(512), allowNull: true },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },
    thumbnailUrl: { type: Sequelize.STRING(500), allowNull: false },
    categoryId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
    },
    instructorId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
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

  await queryInterface.addIndex('courses', ['categoryId'], { name: 'idx_courses_categoryId' });
  await queryInterface.addIndex('courses', ['instructorId'], { name: 'idx_courses_instructorId' });
  await queryInterface.addIndex('courses', ['status', 'createdAt'], { name: 'idx_courses_status_createdAt' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("courses");
}
