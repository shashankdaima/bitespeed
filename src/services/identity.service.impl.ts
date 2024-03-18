import { PrismaClient } from "@prisma/client";
import { IdentityResponse } from "../models/identity.post.response";
import { Exception, Result } from "../utils/result.util";
import { IdentityService } from "./identity.service";
const prisma = new PrismaClient();
export class IdentityServiceImpl implements IdentityService {
    async identifyUser(email: string, phoneNumber: string): Promise<Result<IdentityResponse>>  {
        // prisma.contact.
        return new Exception("Method not implemented.");
    }
}