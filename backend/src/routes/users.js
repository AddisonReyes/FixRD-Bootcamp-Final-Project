import express from "express";
import verifyToken from "../middlewares/auth.js";
import User from "../models/user.js";
const env = process.env.NODE_ENV || "dev";
const url = "/users";
const userRouter = express.Router();
// GET /api/users/me - Authenticated user's profile
userRouter.get(url + "/me", verifyToken, async (req, res) => {
    const userInfo = req.user;
    const user = await User.findOne({ email: userInfo.email });
    userInfo.name = user?.name;
    userInfo.id = user?._id;
    res.status(200).json({ userInfo });
});
export default userRouter;
//# sourceMappingURL=users.js.map