"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const videos_router_1 = require("./videos/routers/videos.router");
const testing_roter_1 = require("./testing/routers/testing.roter");
const setupApp = (app) => {
    app.use(express_1.default.json());
    app.use("/videos", videos_router_1.videoRouter);
    app.use("/testing", testing_roter_1.testingRouter);
    app.get("/", (req, res) => {
        res.status(200).send("Это главная страничка");
    });
};
exports.setupApp = setupApp;
