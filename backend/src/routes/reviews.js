import { Router } from "express";
import verifyToken from "../middlewares/auth.js";
import Review from "../models/review.js";
const env = process.env.NODE_ENV || "dev";
const url = "/reviews";
const router = Router();
// POST /api/reviews - Create review
router.post(url, verifyToken, async (req, res) => {
    try {
        const { requestId, technicianId, clientId, rating, comment } = req.body;
        if (!requestId || !technicianId || !clientId || !rating) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const review = await Review.create({
            requestId,
            technicianId,
            clientId,
            rating,
            comment,
        });
        return res.status(201).json(review);
    }
    catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({
            message: "Error creating review",
            error,
        });
    }
});
// GET /api/reviews/:technicianId - Get reviews of a technician
router.get(url + "/:technicianId", verifyToken, async (req, res) => {
    try {
        const { technicianId } = req.params;
        if (!technicianId) {
            return res.status(400).json({ message: "Technician ID required" });
        }
        const reviews = await Review.find({ technicianId }).sort({
            createdAt: -1,
        });
        return res.status(200).json(reviews);
    }
    catch (error) {
        console.error("Error retrieving reviews:", error);
        return res.status(500).json({
            message: "Error retrieving reviews",
            error,
        });
    }
});
export default router;
//# sourceMappingURL=reviews.js.map