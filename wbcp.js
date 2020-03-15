const express = require('express');
const port = process.env.PORT;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
