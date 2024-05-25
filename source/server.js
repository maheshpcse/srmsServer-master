'use strict';
// require modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// require middleware functions
app.use(cors());
