const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/upload');

const app = express();
app.use(cors());
app.use('/upload', uploadRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
