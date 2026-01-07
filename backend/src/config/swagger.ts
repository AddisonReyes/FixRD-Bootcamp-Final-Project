import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const env: string = process.env.NODE_ENV || "dev";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Técnicos",
      version: "1.0.0",
      description: "API para gestión de técnicos, solicitudes y reseñas",
      contact: {
        name: "Equipo de desarrollo",
      },
    },
    servers: [
      {
        url: env === "dev" ? "http://localhost:3000" : process.env.URL || "",
        description:
          env === "dev" ? "Servidor de desarrollo" : "Servidor de producción",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "auth-token",
          in: "header",
          description: "Token JWT para autenticación",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["client", "technician"] },
            createAt: { type: "string", format: "date-time" },
          },
        },
        Technician: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            categories: { type: "array", items: { type: "string" } },
            pricePerHour: { type: "number" },
            rating: { type: "number", minimum: 0, maximum: 5 },
            description: { type: "string" },
            location: { type: "string" },
            photo: { type: "string" },
          },
        },
        Request: {
          type: "object",
          properties: {
            _id: { type: "string" },
            technicianId: { type: "string" },
            clientId: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date-time" },
            status: {
              type: "string",
              enum: ["pending", "accepted", "completed", "cancelled"],
            },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: { type: "string" },
            rating: { type: "number", minimum: 1, maximum: 5 },
            technicianId: { type: "string" },
            requestId: { type: "string" },
            clientId: { type: "string" },
            comment: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            status: { type: "number" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "API Técnicos - Documentación",
    })
  );

  // Endpoint para obtener el JSON de Swagger
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  if (env === "dev") {
    console.log("Swagger disponible en http://localhost:3000/api-docs");
  }
};
