const express = require('express');
const {mysql} = require('./config/mysql');
const routess = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use((req, _, next) => {
    req.mysql = mysql;
    next()
})

app.get('/checkservice', (req, res) => {
    res.send('Service usermanagement is up -> V1.1');
})

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}));
app.use('/upload', express.static(path.join(__dirname, '../upload')));
// const upload = require('./middleware/multerConfig');
// app.use('/upload', upload);



app.use(cors());
app.use(cookieParser());

app.use('/v2', routess);


module.exports = app;
