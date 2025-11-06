export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("enrollments", {
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
    orderItemId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "order_items", key: "id" },
        onDelete: "SET NULL",
    },
    progress: { type: Sequelize.JSON, allowNull: true },
    startedAt: { type: Sequelize.DATE, allowNull: true },
    completedAt: { type: Sequelize.DATE, allowNull: true },
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

  await queryInterface.addConstraint("enrollments", {
    fields: ["userId", "courseId"],
    type: "unique",
    name: "unique_user_course_enrollment",
  });

  await queryInterface.addIndex('enrollments', ['courseId'], { name: 'idx_enrollments_courseId' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("enrollments");
}
