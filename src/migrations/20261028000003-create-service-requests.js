module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_requests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null
      },
      serviceType: {
        type: Sequelize.ENUM(
          'web-development',
          'api-development',
          'database-design',
          'deployment',
          'consulting',
          'other'
        ),
        allowNull: false
      },
      budgetRange: {
        type: Sequelize.STRING(80),
        allowNull: true,
        defaultValue: null
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('new', 'in-review', 'accepted', 'rejected', 'completed'),
        allowNull: false,
        defaultValue: 'new'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('service_requests', ['status']);
    await queryInterface.addIndex('service_requests', ['serviceType']);
    await queryInterface.addIndex('service_requests', ['email']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('service_requests');
  }
};
