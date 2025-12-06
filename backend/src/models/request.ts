import mongoose, { Schema } from "mongoose";
import { IRequest } from "@bootcamp/core";

const statusEnum = ["pending", "accepted", "completed", "cancelled"];
const RequestSchema: Schema = new Schema({
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

const RequestModel = mongoose.model<IRequest>("Request", RequestSchema);

export default RequestModel;
