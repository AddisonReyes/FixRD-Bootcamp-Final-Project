import mongoose from "mongoose";
import { IReview } from "@bootcamp/core";
declare const Review: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, {}> & IReview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Review;
//# sourceMappingURL=review.d.ts.map