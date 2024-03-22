import { IdentityResponse } from '../models/identity.post.response';
import{Result, Success, Exception} from '../utils/result.util';
import { PrismaClient } from "@prisma/client";
export interface IdentityService{
    identifyUser(prisma:PrismaClient,email:string|null,phoneNumber:string|null):Promise<Result<IdentityResponse>>;
}