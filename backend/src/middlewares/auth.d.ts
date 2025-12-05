import express, { Request, Response, NextFunction } from "express";
declare const verifyToken: (req: Request, res: Response, next: NextFunction) => express.Response<any, Record<string, any>> | undefined;
export default verifyToken;
//# sourceMappingURL=auth.d.ts.map