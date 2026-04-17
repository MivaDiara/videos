import { Router, Request, Response } from 'express';
import {ErrorType} from "../../core/types/errortypes";
import {db} from "../../db/db";
import {Video, VideoResolution} from "../types/video";


export const videoRouter = Router();

videoRouter
.get("", (req: Request, res: Response) => {
    res.status(200).send(db.videos);
})
.get("/:id", (req: Request, res: Response) => {
    const foundVideo = db.videos.find((e) => e.id === Number(req.params.id))

    if(!foundVideo){
        let errors: ErrorType[] = []
        errors.push({message: 'No video found', field: 'videoId'});
        res.status((404)).send(errors);
    }
    else {
        res.status(200).send(foundVideo);
    }
})
.post("", (req: Request, res: Response) => {
    let errors: ErrorType[] = []
    if (!req.body.title || req.body.title.length > 40) {
        errors.push({message: 'Title is wrong', field: 'title'});
    }
    if (!req.body.author || req.body.author.length > 20) {
        errors.push({message: "Author is wrong", field: "author"});
    }
    if (!req.body.availableResolutions || !Array.isArray(req.body.availableResolutions) ) {
        const validResolutions = Object.values(VideoResolution);
        for (const resolution of req.body.availableResolutions){
            if (!validResolutions.includes(resolution)){
                errors.push({message: "Not available resolution", field: "resolution"})
            }
        }
    }
    if(errors.length === 0) {
        const newVideo: Video = {
            id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
            canBeDownloaded: false,
            minAgeRestriction: 1,
            createdAt: new Date(),
            publicationDate: new Date(Date.now() + 86400000),
            ...req.body,
        }
        db.videos.push(newVideo);
        return res.status(201).send(newVideo);
    }
    return res.status(400).send(errors);
})
    .put("/:id", (req: Request, res: Response) => {
        let errors: ErrorType[] = [];
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+\-]\d{2}:\d{2})$/;
        let foundVideo = db.videos.find((e) => e.id === Number(req.params.id));
        if(!req.body.title || req.body.title.length > 40) {
            errors.push({message: 'Title is wrong', field: 'title'});
        }
        if (!req.body.author || req.body.author.length > 20) {
            errors.push({message: 'Author is wrong', field: 'author'});
        }
        if (req.body.minAgeRestriction !== undefined) {
            if (req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
                errors.push({message: 'minAgeRestriction must be between 1 and 18', field: 'minAgeRestriction'});
            }
        }
        if(!req.body.publicationDate || !isoRegex.test(req.body.publicationDate)){
            errors.push({message: 'Publication date is wrong', field: 'publicationDate'})
        }
        if(!foundVideo){
            return res.status(404).send('Not found');
        }
        if (!req.body.availableResolutions || req.body.availableResolutions && Array.isArray(req.body.availableResolutions) ) {
            const validResolutions = Object.values(VideoResolution);
            for (const resolution of req.body.availableResolutions){
                if (!validResolutions.includes(resolution)){
                    errors.push({message: "Not available resolution", field: "resolution"})
                }
            }
        }
        if(errors.length === 0) {
            const updateVideo ={
                ...foundVideo,
                ...req.body,
                id: Number(req.params.id)
            };
            const videoIndex = db.videos.findIndex(v => v.id === Number(req.params.id));
            db.videos[videoIndex] = updateVideo;
            return res.status(204).send(updateVideo);
        }
        res.status(400).send(errors);
    })
    .delete("/:id", (req: Request, res: Response) => {
        let index = db.videos.findIndex(v => v.id === Number(req.params.id));
        if (index === -1){
            return res.status(404).send('Not found');
        }
        db.videos.splice(index, 1);
        res.status(204).send();
    })
