import mongoose from "mongoose";
import { IRequest } from "@bootcamp/core";
declare const RequestModel: mongoose.Model<IRequest, {}, {}, {}, mongoose.Document<unknown, {}, IRequest, {}, {}> & IRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default RequestModel;
//# sourceMappingURL=request.d.ts.map