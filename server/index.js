require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:8888/callback';
let FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
const PORT = process.env.PORT || 8888;

if (process.env.NODE_ENV !== 'production') {
    REDIRECT_URI = 'http://localhost:8888/callback';
    FRONTEND_URI = 'http://localhost:3000';
}

const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const history = require('connect-history-api-fallback');

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0;i<length;i++){
        text += possible.charAt(Math.floor(Math.random * possible.length));
    }
    return text;
}

const stateKey = 'spotify_auth_state';


//Multi-process to utilize all CPU cores
if(cluster.isMaster){
    console.warn(`Node cluster master ${process.id} is running`);

    //For workers.
    for(let i=0;i<numCPUs;i++){
        cluster.fork();
    }

    cluster.on('exit',(worker,code,signal)=>{
        console.error(
            `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
        );
    })
}else{
    const app = express();

    //Prority server any static files.
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app
        .use(express.cors())
        .use(express.cookieParser())
        .use(
            history({
                verbose : true,
                rewrites: [
                    { from: /\/login/, to: '/login' },
                    { from: /\/callback/, to: '/callback' },
                    { from: /\/refresh_token/, to: '/refresh_token' },
                ], 
            }),
        )
    
    app.get('/', function (req, res) {
        res.render(path.resolve(__dirname, '../client/build/index.html'));
    });

    

    app.listen(PORT, function() {
        console.warn(`Node cluster worker ${process.pid} : listening on port :${PORT}`);
    });
}