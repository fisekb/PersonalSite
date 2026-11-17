module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'projects',
      [
        {
          id: '22222222-2222-4222-8222-222222222222',
          title: 'E-Commerce API Platform',
          slug: 'e-commerce-api-platform',
          description: 'A production-ready API for a multi-vendor storefront with order processing and inventory tracking.',
          longDescription:
            'Built a scalable backend for an online marketplace with secure authentication, product management, order workflows, and analytics endpoints. The project emphasizes clean service layers, validation, and PostgreSQL relationships to keep the domain model maintainable as traffic grows.',
          techStack: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'JWT'],
          imageUrl: '/images/projects/ecommerce-api.jpg',
          liveUrl: 'https://example.com/ecommerce',
          repoUrl: 'https://github.com/yourname/ecommerce-api',
          featured: true,
          displayOrder: 1,
          userId: '11111111-1111-4111-8111-111111111111',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '33333333-3333-4333-8333-333333333333',
          title: 'Task Management Dashboard',
          slug: 'task-management-dashboard',
          description: 'A collaborative productivity dashboard with team workflows, comments, and project tracking.',
          longDescription:
            'Designed and implemented a task management dashboard for distributed teams, including role-based permissions, activity logs, and deadline handling. The app focuses on transparent database design and admin-level monitoring to reduce operational friction in growing teams.',
          techStack: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'REST API'],
          imageUrl: '/images/projects/task-dashboard.jpg',
          liveUrl: 'https://example.com/task-dashboard',
          repoUrl: 'https://github.com/yourname/task-dashboard',
          featured: true,
          displayOrder: 2,
          userId: '11111111-1111-4111-8111-111111111111',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '44444444-4444-4444-8444-444444444444',
          title: 'Portfolio Website CMS',
          slug: 'portfolio-website-cms',
          description: 'A content management backend for personal portfolio pages with project and inquiry management.',
          longDescription:
            'Created a lightweight CMS where content updates are managed through a secure admin interface. The architecture separates business logic from the API layer and keeps project content easy to extend without rewriting the data model each time.',
          techStack: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'Admin Panels'],
          imageUrl: '/images/projects/portfolio-cms.jpg',
          liveUrl: 'https://example.com/portfolio-cms',
          repoUrl: 'https://github.com/yourname/portfolio-cms',
          featured: false,
          displayOrder: 3,
          userId: '11111111-1111-4111-8111-111111111111',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('projects', {
      slug: {
        [require('sequelize').Op.in]: [
          'e-commerce-api-platform',
          'task-management-dashboard',
          'portfolio-website-cms'
        ]
      }
    });
  }
};
