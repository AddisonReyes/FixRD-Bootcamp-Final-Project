import mongoose, { Schema } from "mongoose";
const TechnicianSchema = new Schema({
    userId: { type: String, require: true, unique: true },
    categories: { type: [String], default: [] },
    pricePerHour: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    description: { type: String },
    location: { type: String },
    photo: { type: String },
});
const Technician = mongoose.model("technician", TechnicianSchema);
export default Technician;
//# sourceMappingURL=technician.js.map