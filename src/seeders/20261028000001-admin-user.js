const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  async up(queryInterface) {
    const adminName = process.env.ADMIN_NAME || 'Fistum';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD must be set before seeding the admin user.');
    }
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: '11111111-1111-4111-8111-111111111111',
          name: adminName,
          email: adminEmail.trim().toLowerCase(),
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: process.env.ADMIN_EMAIL || 'admin@example.com'
    });
  }
};
