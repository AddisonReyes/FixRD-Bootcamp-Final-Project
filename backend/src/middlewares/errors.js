import express from "express";
const errors = express.Router();
// Client errors
errors.use((req, res) => {
    res.status(404).json({ message: "Not Found", status: 404 });
});
// Server errors
errors.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message, status: 500 });
});
export default errors;
//# sourceMappingURL=errors.js.map