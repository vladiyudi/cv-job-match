const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { matchJobCvRaw } = require('./middleware/matchJobCv');
const { createCV } = require('./middleware/createCVJSON');
const { cvToHtml } = require('./middleware/cvToHtml');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.post('/matchJobCv', 
  matchJobCvRaw, createCV, 
  cvToHtml);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});