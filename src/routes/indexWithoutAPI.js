const express = require('express');
const api = express.Router();

const routes = [];

routes.forEach((route) => require(`./${route}`)(api))
module.exports = api;
