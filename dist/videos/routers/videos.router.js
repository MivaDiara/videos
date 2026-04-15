"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../db/db");
const video_1 = require("../types/video");
exports.videoRouter = (0, express_1.Router)();
exports.videoRouter
    .get("", (req, res) => {
    res.status(200).send(db_1.db.videos);
})
    .get("/:id", (req, res) => {
    const foundVideo = db_1.db.videos.find((e) => e.id === Number(req.params.id));
    if (!foundVideo) {
        let errors = [];
        errors.push({ message: 'No video found', field: 'videoId' });
        res.status((404)).send(errors);
    }
    else {
        res.status(200).send(foundVideo);
    }
})
    .post("", (req, res) => {
    let errors = [];
    if (!req.body.title || req.body.title.length > 40) {
        errors.push({ message: 'Title is wrong', field: 'title' });
    }
    if (!req.body.author || req.body.author.length > 20) {
        errors.push({ message: "Author is wrong", field: "author" });
    }
    if (!req.body.availableResolutions || req.body.availableResolutions && Array.isArray(req.body.availableResolutions)) {
        const validResolutions = Object.values(video_1.VideoResolution);
        for (const resolution of req.body.availableResolution) {
            if (!validResolutions.includes(resolution)) {
                errors.push({ message: "Not available resolution", field: "resolution" });
            }
        }
    }
    if (errors.length === 0) {
        const newVideo = Object.assign({ id: db_1.db.videos.length ? db_1.db.videos[db_1.db.videos.length - 1].id + 1 : 1, canBeDownload: false, minAgeRestriction: 1, createdAt: new Date(), publicationDate: new Date(Date.now() + 86400000) }, req.body);
        db_1.db.videos.push(newVideo);
        return res.status(201).send(newVideo);
    }
    return res.status(400).send(errors);
})
    .put("/:id", (req, res) => {
    let errors = [];
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+\-]\d{2}:\d{2})$/;
    let foundVideo = db_1.db.videos.find((e) => e.id === Number(req.params.id));
    if (!req.body.title || req.body.title.length > 40) {
        errors.push({ message: 'Title is wrong', field: 'title' });
    }
    if (!req.body.author || req.body.author.length > 20) {
        errors.push({ message: 'Author is wrong', field: 'author' });
    }
    if (req.body.minAgeRestriction !== undefined) {
        if (req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
            errors.push({ message: 'minAgeRestriction must be between 1 and 18', field: 'minAgeRestriction' });
        }
    }
    if (!req.body.publicationDate || !isoRegex.test(req.body.publicationDate)) {
        errors.push({ message: 'Publication date is wrong', field: 'publicationDate' });
    }
    if (!foundVideo) {
        return res.status(404).send('Not found');
    }
    if (!req.body.availableResolutions || req.body.availableResolutions && Array.isArray(req.body.availableResolutions)) {
        const validResolutions = Object.values(video_1.VideoResolution);
        for (const resolution of req.body.availableResolution) {
            if (!validResolutions.includes(resolution)) {
                errors.push({ message: "Not available resolution", field: "resolution" });
            }
        }
    }
    if (errors.length === 0) {
        const updateVideo = Object.assign(Object.assign(Object.assign({}, foundVideo), req.body), { id: Number(req.params.id) });
        const videoIndex = db_1.db.videos.findIndex(v => v.id === Number(req.params.id));
        db_1.db.videos[videoIndex] = updateVideo;
        return res.status(200).send(updateVideo);
    }
    res.status(400).send(errors);
})
    .delete("/:id", (req, res) => {
    let index = db_1.db.videos.findIndex(v => v.id === Number(req.params.id));
    if (index === -1) {
        return res.status(404).send('Not found');
    }
    db_1.db.videos.splice(index, 1);
    res.status(204).send();
});
