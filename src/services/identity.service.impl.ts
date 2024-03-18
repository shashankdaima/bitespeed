import { IdentityResponse } from "../models/identity.post.response";
import { Exception, Result } from "../utils/result.util";
import { IdentityService } from "./identity.service";

export class IdentityServiceImpl implements IdentityService {
    identifyUser(email: string, phoneNumber: string): Result<IdentityResponse> {
        return new Exception("Method not implemented.");
    }
}