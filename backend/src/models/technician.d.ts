import mongoose from "mongoose";
import { ITechnician } from "@bootcamp/core";
declare const Technician: mongoose.Model<ITechnician, {}, {}, {}, mongoose.Document<unknown, {}, ITechnician, {}, {}> & ITechnician & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Technician;
//# sourceMappingURL=technician.d.ts.map