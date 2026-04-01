import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
      description: 'API documentation for the Library Management System',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication and User management endpoints' },
      { name: 'Books', description: 'Book management endpoints' },
      { name: 'Authors', description: 'Author management endpoints' },
      { name: 'Borrowing', description: 'Book borrowing and returning endpoints' },
      { name: 'Reports', description: 'Analytical reports and exports' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },

    ...(config.nodeEnv === 'production' && {
      security: [
        {
          bearerAuth: [],
        },
      ],
    }),
  },
  apis: ['./src/routes/*.ts', './src/docs/swagger/auth.swagger.ts', './src/docs/swagger/book.swagger.ts', './src/docs/swagger/author.swagger.ts', './src/docs/swagger/borrowing.swagger.ts', './src/docs/swagger/report.swagger.ts'],
};

const swaggerSpec: any = swaggerJsdoc(options);

// Define tags order
if (swaggerSpec.tags && Array.isArray(swaggerSpec.tags)) {
  const tagOrder = [
    'Auth',
    'Books',
    'Authors',
    'Borrowing',
    'Reports',
  ];

  // Sort tags according to the specified order
  swaggerSpec.tags = swaggerSpec.tags.sort((a: any, b: any) => {
    const aIndex = tagOrder.indexOf(a.name);
    const bIndex = tagOrder.indexOf(b.name);

    // If tag is in the order list, use its index
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // If only a is in the order list, a comes first
    if (aIndex !== -1) {
      return -1;
    }
    // If only b is in the order list, b comes first
    if (bIndex !== -1) {
      return 1;
    }
    // If neither is in the order list, maintain alphabetical order
    return a.name.localeCompare(b.name);
  });
}

export { swaggerSpec };

