import { RequestHandler } from "express";
export const identifyUser: RequestHandler = async (req, res, next) => {
    try{
        res.json({
            message: "User Identified successfully"
        });
    }catch(err){
        next(err);
    }
}
