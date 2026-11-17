module.exports = (sequelize, DataTypes) => {
  const ServiceRequest = sequelize.define(
    'ServiceRequest',
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
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null
      },
      serviceType: {
        type: DataTypes.ENUM(
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
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('new', 'in-review', 'accepted', 'rejected', 'completed'),
        allowNull: false,
        defaultValue: 'new'
      }
    },
    {
      tableName: 'service_requests',
      timestamps: true,
      underscored: false,
      indexes: [
        {
          fields: ['status']
        },
        {
          fields: ['serviceType']
        },
        {
          fields: ['email']
        }
      ]
    }
  );

  return ServiceRequest;
};
