module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 150]
        }
      },
      slug: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 150]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      longDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      techStack: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
      },
      imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      liveUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      repoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      tableName: 'projects',
      timestamps: true,
      underscored: false,
      indexes: [
        {
          unique: true,
          fields: ['slug']
        },
        {
          fields: ['featured']
        },
        {
          fields: ['displayOrder']
        },
        {
          fields: ['userId']
        }
      ]
    }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'SET NULL'
    });
  };

  return Project;
};
