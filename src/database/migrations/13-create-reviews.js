export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("reviews", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    courseId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "courses", key: "id" },
      onDelete: "CASCADE",
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: { type: Sequelize.TEXT, allowNull: true },
    status: {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
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

  await queryInterface.addIndex('reviews', ['courseId'], { name: 'idx_reviews_courseId' });
  await queryInterface.addIndex('reviews', ['courseId', 'status'], { name: 'idx_reviews_courseId_status' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("reviews");
}
