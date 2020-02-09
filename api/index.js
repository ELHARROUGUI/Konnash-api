'use strict';

import express from 'express';
import bodyParser from 'body-parser';

import database from './Database';
import schemas from './Database/schemas';

import tagRoutes from './Routes/tag';
import noteRoutes from './Routes/note';
import accountRoutes from './Routes/account';
import stickerRoutes from './Routes/sticker';

database.init(schemas);
const app = express();

const PORT = 7114;
const PATHS = {
  API: {
    V1: '/api/v1'
  }
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(`${PATHS.API.V1}/tag`, tagRoutes);
app.use(`${PATHS.API.V1}/note`, noteRoutes);
app.use(`${PATHS.API.V1}/account`, accountRoutes);
app.use(`${PATHS.API.V1}/sticker`, stickerRoutes);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to Konnash API.'
}));

app.listen(PORT, () => console.log(`🚀  Server ready at port ${PORT}`));
