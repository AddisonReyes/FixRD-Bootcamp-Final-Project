import mongoose, { Schema } from "mongoose";
const statusEnum = ["pending", "accepted", "completed", "cancelled"];
const RequestSchema = new Schema({
    technicianId: { type: String, required: true },
    description: { type: String, required: true },
    clientId: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: statusEnum,
        default: statusEnum[0],
    },
});
const RequestModel = mongoose.model("Request", RequestSchema);
export default RequestModel;
//# sourceMappingURL=request.js.map