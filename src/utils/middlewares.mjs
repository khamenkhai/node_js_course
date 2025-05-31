import { mockUsers } from "./constants.mjs";
// Middleware to resolve user index by ID
export const resolveIndexByUserId = (req, res, next) => {
    const parsedId = parseInt(req.params.id);
    const userIndex = mockUsers.findIndex(user => user.id === parsedId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    req.userIndex = userIndex;
    req.userId = parsedId;
    next();
};

