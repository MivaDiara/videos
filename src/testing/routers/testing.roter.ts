import {Router, Request, Response} from "express";
import {db} from "../../db/db";


export const testingRouter = Router();

testingRouter
.delete("/all-data", (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(204);
})