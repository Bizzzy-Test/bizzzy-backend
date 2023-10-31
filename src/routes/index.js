const express = require('express');
const api = express.Router();

const routes = [
    `auth`,
    `country`,
    `jobProposal`,
    `message`,
    `invite`
];

routes.forEach((route) => require(`./${route}`)(api))
module.exports = api;
