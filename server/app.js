require('dotenv').config();
const express = require('express');
const app = express();
const port = Number(process.env.PORT) || 3000;
const cors = require('cors');
const router = require('./routes');

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// app.get('/', (_, res) => res.json({ message: 'Tracking service is running' }))
app.use('/', router)

if (process.env.NODE_ENV !== 'test') app.listen(port, () => console.log('App is running at port', port))

module.exports = app;
