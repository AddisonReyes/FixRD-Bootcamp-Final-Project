import { Document } from "mongoose";
export type role = "client" | "technician";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: role;
    createAt: Date;
}
export interface ITechnician extends Document {
    userId: string;
    categories: string[];
    pricePerHour: number;
    description: string;
    location: string;
    photo: string;
    rating: number;
}
export type status = "pending" | "accepted" | "completed" | "cancelled";
export interface IRequest extends Document {
    clientId: string;
    technicianId: string;
    description: string;
    date: Date;
    status: status;
}
export interface IReview extends Document {
    requestId: string;
    technicianId: string;
    clientId: string;
    rating: number;
    comment: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
}
//# sourceMappingURL=types.d.ts.map