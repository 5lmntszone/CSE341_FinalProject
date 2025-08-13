import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { 
      title: "Book Club API", 
      version: "1.0.0",
      description: "API documentation for the Book Club application"
    },
    servers: [
      { url: "/" } 
    ]
  },
  apis: [
    "./routes/booksRoutes.js",
    "./routes/reviewsRoutes.js",
    "./routes/meetingsRoutes.js",
    "./routes/usersRoutes.js",
    "./routes/authRoutes.js"
  ]
};

export const specs = swaggerJSDoc(options);

export const swaggerMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: { persistAuthorization: true }
  })
];