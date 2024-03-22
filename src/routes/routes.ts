import express from 'express';
import { identifyUser } from '../controllers/identify.controller';
const router = express.Router();
/**
 * @swagger
 * /identify:
 *   post:
 *     summary: Endpoint to identify user
 *     description: This endpoint identifies a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.post("/identify",identifyUser);
export { router as routes };