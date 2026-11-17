module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 120]
        }
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
      }
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: false,
      indexes: [
        {
          unique: true,
          fields: ['email']
        },
        {
          fields: ['role']
        }
      ]
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Project, {
      foreignKey: 'userId',
      as: 'projects',
      onDelete: 'SET NULL'
    });
  };

  return User;
};
