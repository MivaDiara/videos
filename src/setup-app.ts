import express, {Express, Request, Response} from "express";
import {videoRouter} from "./videos/routers/videos.router";
import {testingRouter} from "./testing/routers/testing.roter";

export const setupApp = (app: Express) => {
    app.use(express.json());
    app.use("/videos", videoRouter);
    app.use("/videos/testing", testingRouter);


    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Это главная страничка");
    })};