"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopics = void 0;
const getTopics = (req, res) => {
    const topics = ["Planets", "Stars", "Galaxies", "Space Exploration"];
    console.log('Sending topics:', topics);
    res.json(topics);
};
exports.getTopics = getTopics;
