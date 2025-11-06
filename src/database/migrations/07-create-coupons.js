export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("coupons", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    description: { type: Sequelize.STRING(255), allowNull: true },
    discountType: { type: Sequelize.ENUM("percentage", "fixed"), allowNull: false },
    value: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    usageCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    maxUsage: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    validFrom: { type: Sequelize.DATE, allowNull: true },
    validTo: { type: Sequelize.DATE, allowNull: true },
    minOrderValue: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.ENUM("active", "inactive", "expired"),
      allowNull: false,
      defaultValue: "active",
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

  await queryInterface.addIndex('coupons', ['status'], { name: 'idx_coupons_status' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("coupons");
}
