module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      longDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      techStack: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: []
      },
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      liveUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      repoUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    await queryInterface.addIndex('projects', ['featured']);
    await queryInterface.addIndex('projects', ['displayOrder']);
    await queryInterface.addIndex('projects', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('projects');
  }
};
