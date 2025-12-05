import mongoose, { Schema } from "mongoose";
const role = ["client", "technician"];
const UserSchema = new Schema({
    role: { type: String, enum: role },
    password: { type: String, require: true },
    email: { type: String, require: true },
    name: { type: String, require: true },
    createAt: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model("user", UserSchema);
export default User;
//# sourceMappingURL=user.js.map