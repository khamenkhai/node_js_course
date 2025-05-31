import { Router } from "express";
import {
    query,
    validationResult,
    checkSchema,
    matchedData,
    body
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

const router = Router();

// Helper to return validation errors as JSON
const handleValidationErrors = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    next();
};

// GET /api/users with filter validation
router.get(
    "/api/users",
    [
        query("filter").isString().notEmpty().withMessage("Filter is required"),
        query("value").optional().isString().notEmpty().withMessage("Value cannot be empty if provided"),
        handleValidationErrors,
    ],
    (req, res) => {
        const { filter, value } = req.query;

        if (value) {
            return res.json(
                mockUsers.filter(user =>
                    user[filter]?.toLowerCase().includes(value.toLowerCase())
                )
            );
        }

        return res.json(mockUsers);
    }
);

// POST /api/users
router.post(
    "/api/users",
    checkSchema(createUserValidationSchema),
    handleValidationErrors,
    (req, res) => {
        const { username, displayName, password } = req.body;

        const newUser = {
            id: mockUsers[mockUsers.length - 1]?.id + 1 || 1,
            username,
            displayName,
            password
        };

        mockUsers.push(newUser);
        return res.status(201).json(mockUsers);
    }
);

// GET /api/users/:id
router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    return res.status(200).json(mockUsers[req.userIndex]);
});

// PUT /api/users/:id - Full update
router.put(
    "/api/users/:id",
    [
        resolveIndexByUserId,
        body("username").isString().notEmpty().withMessage("Username is required"),
        handleValidationErrors,
    ],
    (req, res) => {
        const { username, displayName, password } = req.body;
        mockUsers[req.userIndex] = { id: req.userId, username: username, displayName, displayName, password: password };
        return res.status(200).json(mockUsers);
    }
);


// PATCH /api/users/:id - Partial update
router.patch(
    "/api/users/:id",
    [
        resolveIndexByUserId,
        body("username").optional().isString().notEmpty().withMessage("Username cannot be empty"),
        handleValidationErrors,
    ],
    (req, res) => {
        Object.assign(mockUsers[req.userIndex], req.body);
        return res.status(200).json(mockUsers);
    }
);

// DELETE /api/users/:id
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    mockUsers.splice(req.userIndex, 1);
    return res.status(200).json({ message: "User deleted successfully", users: mockUsers });
});



export default router;