//import module
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3001;

// connection mongoDB
const connectDB = require('./database/db');
connectDB();

//import router
const userRouter = require('./router/userRouter');

//setting cors, morgan
app.use(cors());
app.use(logger('dev'));
//setup post
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Authorization, authorization, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});

//setup public url for file
app.use(express.static(path.join(__dirname, 'public')));

//url
// app.use('/api/category', categoryRouter);

//client
// app.use('/api/client', homeRouter);


app.listen(port, () => {
    console.log(`app listening to http://localhost:${port}`);
});