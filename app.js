const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');
const imageRoutes = require('./routes/image');

const PORT = process.env.PORT || 3000;
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

require('./socket')(io);

app.use(cors());

app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());

mongoose.connect(config.dburl, { useNewUrlParser : true });

app.use('/api/blogapp', userRoutes);
app.use('/api/blogapp', authRoutes);
app.use('/api/blogapp', blogRoutes);
app.use('/api/blogapp', imageRoutes);

server.listen(PORT, () => {
    console.log("The server is running on port " + PORT);
});