import express, { Request, Response } from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import joi from "joi";

const env: string = process.env.NODE_ENV || "dev";
const url: string = "/auth";

const schemaRegister = joi.object({
  name: joi.string().min(6).max(255).required(),
  email: joi.string().min(6).max(255).required().email(),
  password: joi.string().min(6).max(255).required(),
});

const schemaLogin = joi.object({
  email: joi.string().min(6).max(255).required().email(),
  password: joi.string().min(6).max(255).required(),
});

const authRouter = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 255
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 255
 *                 example: password123
 *     responses:
 *       204:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación o correo ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post(url + "/register", async (req: Request, res: Response) => {
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details });
  }

  const existeCorreo = await User.findOne({ email: req.body.email });
  if (existeCorreo)
    return res.status(400).json({ error: "Este correo ya esta registrado" });

  try {
    const newUser = new User(req.body);
    const salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         headers:
 *           auth-token:
 *             description: Token JWT para autenticación
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Credenciales incorrectas o usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post(url + "/login", async (req: Request, res: Response) => {
  const { error } = schemaLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const usuario = await User.findOne({ email: req.body.email });
  if (!usuario) {
    return res
      .status(400)
      .json({ error: "Este correo no se encuentra registrado" });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    usuario.password
  );

  if (!validPassword) {
    return res.status(400).json({ error: "Contraseña incorrecta" });
  }

  const { email } = usuario;
  const token = jwt.sign({ email }, "secret", { expiresIn: "72h" });
  res.header("auth-token", token).json({ token });
});

export default authRouter;
