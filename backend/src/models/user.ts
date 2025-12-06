import mongoose, { Schema } from "mongoose";
import { IUser } from "@bootcamp/core";

const role = ["client", "technician"];
const UserSchema: Schema = new Schema({
  role: { type: String, enum: role },
  password: { type: String, require: true },
  email: { type: String, require: true },
  name: { type: String, require: true },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model<IUser>("user", UserSchema);

export default User;
