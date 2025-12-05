import express from "express";
import { Types } from "mongoose";
import Technician from "../models/technician.js";
import verifyToken from "../middlewares/auth.js";
const env = process.env.NODE_ENV || "dev";
const url = "/technicians";
const router = express.Router();
// POST /api/technicians - Create technician
router.post(url, verifyToken, async (req, res) => {
    try {
        const technician = new Technician(req.body);
        const saved = await technician.save();
        res.status(201).json(saved);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error creating the technician.",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
// GET /api/technicians/top - Get top 10 technicians by rating
router.get(url + "/top", verifyToken, async (req, res) => {
    try {
        const topTechnicians = await Technician.find()
            .sort({ rating: -1 })
            .limit(10);
        res.status(200).json(topTechnicians);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error fetching top technicians.",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
// GET /api/technicians/:id - View detailed profile
router.get(url + "/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID." });
        }
        const technician = await Technician.findById(id);
        res.status(200).send(technician);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error finding the technician.",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
// GET /api/technicians - List technicians (with filters)
router.get(url, verifyToken, async (req, res) => {
    const { category, location, minRating, maxRating, minPrice, maxPrice } = req.query;
    const filter = {};
    // Filter by category (searches in categories array)
    if (category) {
        filter.categories = category;
    }
    // Filter by location (case-insensitive partial match)
    if (location) {
        filter.location = { $regex: location, $options: "i" };
    }
    // Filter by rating range
    if (minRating || maxRating) {
        filter.rating = {};
        if (minRating) {
            filter.rating.$gte = Number(minRating);
        }
        if (maxRating) {
            filter.rating.$lte = Number(maxRating);
        }
    }
    // Filter by price per hour range
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
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error fetching technicians.",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
// PUT /api/technicians/:id - Update profile
router.put(url + "/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        await Technician.updateOne({ _id: id }, req.body);
        res.status(200).send({ message: "Ok", status: 200 });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error updating the technician.",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
// DELETE /api/technicians/:id - Delete account
router.delete(url + "/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        await Technician.deleteOne({ _id: id });
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error deleting technician.",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
export default router;
//# sourceMappingURL=technicians.js.map