import { RequestHandler } from "express";
import { z } from "zod";

const userSchema = z.object({
    email: z.string().email(),
    phoneNumber: z.string().regex(/^\d{10}$/),
});

export const identifyUser: RequestHandler = async (req, res, next) => {
    try {
        const parsingResult = userSchema.safeParse(req.body);
        if (parsingResult.success) {
            res.json({
                message: `User Identified successfully ${parsingResult.data.email}`
            });
        } else {
            throw new Error("Invalid User Data");
        }

    } catch (err) {
        next(err);
    }
}

