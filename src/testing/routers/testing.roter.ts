import {Router, Request, Response} from "express";
import {db} from "../../db/db";


export const testingRouter = Router();

testingRouter
.delete("", (req: Request, res: Response) => {
    db.videos = [];
    res.status(204).send(db.videos);
})