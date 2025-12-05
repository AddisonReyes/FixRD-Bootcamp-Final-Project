import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import joi from "joi";
const env = process.env.NODE_ENV || "dev";
const url = "/auth";
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
// POST /api/auth/register - User registration
authRouter.post(url + "/register", async (req, res) => {
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
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
});
// POST /api/auth/login - Login
authRouter.post(url + "/login", async (req, res) => {
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
    const validPassword = await bcrypt.compare(req.body.password, usuario.password);
    if (!validPassword) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
    }
    const { email } = usuario;
    const token = jwt.sign({ email }, "secret", { expiresIn: "72h" });
    res.header("auth-token", token).json({ token });
});
export default authRouter;
//# sourceMappingURL=auth.js.map