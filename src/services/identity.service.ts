import { IdentityResponse } from '../models/identity.post.response';
import{Result, Success, Exception} from '../utils/result.util';
export interface IdentityService{
    identifyUser(email:string,phoneNumber:string):Result<IdentityResponse>;
}