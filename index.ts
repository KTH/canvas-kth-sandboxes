import {Router, Request, Response} from "express";

const router = Router();

router.get("/_monitor", monitor);

async function monitor(req: Request, res:Response){
    try {
        res.send("OK");
    } catch (error){
        res.send("Application status: ERROR")
    }
    
}