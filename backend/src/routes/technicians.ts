import express, { Request, Response } from "express";
import { Types } from "mongoose";

import verifyToken from "../middlewares/auth.js";
import Technician from "../models/technician.js";
import User from "../models/user.js";

const env: string = process.env.NODE_ENV || "dev";
const url: string = "/technicians";

const router = express.Router();

/**
 * @swagger
 * /api/technicians:
 *   post:
 *     summary: Crear un nuevo técnico
 *     tags: [Técnicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["plomería", "electricidad"]
 *               pricePerHour:
 *                 type: number
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: Técnico especializado en reparaciones del hogar
 *               location:
 *                 type: string
 *                 example: Ciudad de México
 *               photo:
 *                 type: string
 *                 example: https://example.com/photo.jpg
 *     responses:
 *       201:
 *         description: Técnico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technician'
 *       400:
 *         description: Error al crear el técnico
 *       403:
 *         description: Token no proporcionado o inválido
 */
router.post(url, verifyToken, async (req: Request, res: Response) => {
  try {
    const technician = new Technician(req.body);
    const saved = await technician.save();
    res.status(201).json(saved);
  } catch (error) {
    const errorMessage = (error as unknown as Error).message;
    res.status(400).json({
      message: "Error creating the technician.",
      error: env === "dev" ? errorMessage : undefined,
    });
  }
});

/**
 * @swagger
 * /api/technicians/top:
 *   get:
 *     summary: Obtener los 10 técnicos mejor calificados
 *     tags: [Técnicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de técnicos mejor calificados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Technician'
 *       400:
 *         description: Error al obtener los técnicos
 *       403:
 *         description: Token no proporcionado o inválido
 */
router.get(url + "/top", verifyToken, async (req: Request, res: Response) => {
  try {
    const topTechnicians = await Technician.find()
      .sort({ rating: -1 })
      .limit(10);

    res.status(200).json(topTechnicians);
  } catch (error) {
    const errorMessage = (error as unknown as Error).message;
    res.status(400).json({
      message: "Error fetching top technicians.",
      error: env === "dev" ? errorMessage : undefined,
    });
  }
});

/**
 * @swagger
 * /api/technicians/{id}:
 *   get:
 *     summary: Ver perfil detallado de un técnico
 *     tags: [Técnicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del técnico
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Información del técnico
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Technician'
 *                 - type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Técnico no encontrado
 *       403:
 *         description: Token no proporcionado o inválido
 */
router.get(url + "/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id!)) {
      return res.status(400).json({ message: "Invalid ID." });
    }

    const technician = await Technician.findById(id);
    const user = await User.findById(technician!.userId);
    if (!technician || !user) {
      return res.status(404).json({ message: "Technician not found." });
    }

    const technicianInfo = {
      name: user.name,
      email: user.email,
      ...technician.toObject(),
      createdAt: user.createAt,
    };

    res.status(200).send(technicianInfo);
  } catch (error) {
    const errorMessage = (error as unknown as Error).message;
    res.status(400).json({
      message: "Error finding the technician.",
      error: env === "dev" ? errorMessage : undefined,
    });
  }
});

/**
 * @swagger
 * /api/technicians:
 *   get:
 *     summary: Listar técnicos con filtros opcionales
 *     tags: [Técnicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *         example: plomería
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtrar por ubicación (búsqueda parcial)
 *         example: México
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Calificación mínima
 *         example: 4
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Calificación máxima
 *         example: 5
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo por hora
 *         example: 20
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo por hora
 *         example: 100
 *     responses:
 *       200:
 *         description: Lista de técnicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Technician'
 *       400:
 *         description: Error al obtener los técnicos
 *       403:
 *         description: Token no proporcionado o inválido
 */
router.get(url, verifyToken, async (req: Request, res: Response) => {
  const { category, location, minRating, maxRating, minPrice, maxPrice } =
    req.query;
  const filter: any = {};

  if (category) {
    filter.categories = category;
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating) {
      filter.rating.$gte = Number(minRating);
    }
    if (maxRating) {
      filter.rating.$lte = Number(maxRating);
    }
  }

  if (minPrice || maxPrice) {
    filter.pricePerHour = {};
    if (minPrice) {
      filter.pricePerHour.$gte = Number(minPrice);
    }
    if (maxPrice) {
      filter.pricePerHour.$lte = Number(maxPrice);
    }
  }

  try {
    const technicians = await Technician.find(filter);
    res.status(200).send(technicians);
  } catch (error) {
    const errorMessage = (error as unknown as Error).message;
    res.status(400).json({
      message: "Error fetching technicians.",
      error: env === "dev" ? errorMessage : undefined,
    });
  }
});

/**
 * @swagger
 * /api/technicians/{id}:
 *   put:
 *     summary: Actualizar perfil de técnico
 *     tags: [Técnicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del técnico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               pricePerHour:
 *                 type: number
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Técnico actualizado exitosamente
 *       400:
 *         description: ID inválido o error al actualizar
 *       403:
 *         description: Token no proporcionado o inválido
 */
router.put(url + "/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id!)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await Technician.updateOne({ _id: id }, req.body);
    res.status(200).send({ message: "Ok", status: 200 });
  } catch (error) {
    const errorMessage = (error as unknown as Error).message;
    res.status(400).json({
      message: "Error updating the technician.",
      error: env === "dev" ? errorMessage : undefined,
    });
  }
});

/**
 * @swagger
 * /api/technicians/{id}:
 *   delete:
 *     summary: Eliminar cuenta de técnico
 *     tags: [Técnicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del técnico
 *     responses:
 *       204:
 *         description: Técnico eliminado exitosamente
 *       400:
 *         description: ID inválido o error al eliminar
 *       403:
 *         description: Token no proporcionado o inválido
 */
router.delete(
  url + "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id!)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      await Technician.deleteOne({ _id: id });
      res.status(204).send();
    } catch (error) {
      const errorMessage = (error as unknown as Error).message;
      res.status(400).json({
        message: "Error deleting technician.",
        error: env === "dev" ? errorMessage : undefined,
      });
    }
  }
);

export default router;
