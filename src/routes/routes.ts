import express from 'express';
import { identifyUser } from '../controllers/identify.controller';
const router = express.Router();
router.post("/identify",identifyUser);
export { router as routes };