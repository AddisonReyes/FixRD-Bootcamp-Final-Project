import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
    const token = req.headers["auth-token"];
    if (!token) {
        return res.status(403).json({ error: "Token requerido" });
    }
    jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: "Token inválido" });
        }
        req.user = decoded;
        next();
    });
};
export default verifyToken;
//# sourceMappingURL=auth.js.map