import { RequestHandler } from "express";
import { z } from "zod";
import { IdentityService } from "../services/identity.service";
import { IdentityServiceImpl } from "../services/identity.service.impl";
import { Success } from "../utils/result.util";

const userSchema = z.object({
    email: z.string().email(),
    phoneNumber: z.string().regex(/^\d{10}$/),
});

export const identifyUser: RequestHandler = async (req, res, next) => {
    try {
        const parsingResult = userSchema.safeParse(req.body);
        if (parsingResult.success) {
            const service:IdentityService=new IdentityServiceImpl();
            const serviceResponse= await service.identifyUser(parsingResult.data.email, parsingResult.data.phoneNumber);
            if(serviceResponse instanceof Success){
                res.json(serviceResponse.data);
            }else{
                throw Error(serviceResponse.error);
            }

        } else {
            res.status(400).json({message: "Invalid User Data"});
        }

    } catch (err) {
        next(err);
    }
}

