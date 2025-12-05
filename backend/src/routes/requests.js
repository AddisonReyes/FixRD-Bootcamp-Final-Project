import { Router } from "express";
import { Types } from "mongoose";
import RequestModel from "../models/request.js";
import verifyToken from "../middlewares/auth.js";
const env = process.env.NODE_ENV || "dev";
const url = "/requests";
const router = Router();
// POST /api/requests - Create request
router.post(url, verifyToken, async (req, res) => {
    try {
        const request = new RequestModel(req.body);
        const saved = await request.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
});
// GET /api/requests - List requests
router.get(url, verifyToken, async (req, res) => {
    const requests = await RequestModel.find();
    res.json(requests);
});
// PUT /api/requests/:id - Update status
router.put(url + "/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        await RequestModel.updateOne({ _id: id }, req.body);
        res.status(200).send({ message: "Ok", status: 200 });
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
// DELETE /api/requests/:id - Cancel request
router.delete(url + "/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        await RequestModel.deleteOne({ _id: id });
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error updating the technician",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
export default router;
//# sourceMappingURL=requests.js.map