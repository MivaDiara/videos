"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../db/db");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter
    .delete("", (req, res) => {
    db_1.db.videos = [];
    res.status(204).send(db_1.db.videos);
});
