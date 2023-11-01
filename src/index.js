require('dotenv').config();
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const http = require('http').createServer(app);
const cron = require('node-cron');
const connectDb = require('./config/db');
connectDb();

const routes = require('./routes/index');
const routesWithoutAPI = require('./routes/indexWithoutAPI');
const { logger } = require('./utils');

const cors = require('cors');
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors({
  origin: '*'
}));

//Swagger
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

const swaggerPath = process.env.ENVIRONMENT === 'dev' ? 'src/swagger.yaml' : 'src/swagger_prod.yaml';
const file = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = YAML.parse(file);
app.set('views', path.join(__dirname, 'public/mailTemplate'));
app.set('socketio', io);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get("/", async (req, res) => {
  res.send("Welcome to Bizzzy API Server");
});

require('./socket')(io);
const port = process.env.PORT || 5001;

http.listen(port, () => {
  logger.info(`Server Started in port : ${port}!`);
});

module.exports = app;