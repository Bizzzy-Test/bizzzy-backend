const express = require('express');
const api = express.Router();

//Router define your
const routes = [
    `auth`,
    `offer`,
    `country`,
    `job`,
    `jobProposal`,
    `message`,
    `invite`,
    `feedback`,
    `dashboard`,
    `userProfile`
];

routes.forEach((route) => require(`./${route}`)(api))
module.exports = api;
