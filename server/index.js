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
const { response } = require('express');

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

    app.use(cors());
    app.use(cookieParser())
    app.use(
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

    app.get('/login',function (req,res){
        const state = generateRandomString(16);
        res.cookie(stateKey,state)

        // your application requests authorization
        const scope =
            'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public';

        res.redirect(
            `https://accounts.spotify.com/authorize?${querystring.stringify({
                response_type: 'code',
                client_id : CLIENT_ID,
                scope : scope,
                redirect_uri : REDIRECT_URI,
                state : state,
            })}`
        );
    });    

    app.get('/refresh_token', function(req,res){
        const refresh_token = req.query.refresh_token;
        const authOptions = {
            url : 'https://accounts.spotify.com/api/token',
            headers : {
                Authorization : `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
                    'base64'
                )}`
            },
            form : {
                grant_type : 'refresh_token',
                refresh_token,
            },
            json : true,
        };

        request.post(authOptions, function (error, response, body){
            if(!error && response.statusCode === 28){
                const access_token = body.access_token;
                res.send({ access_token });
            }
        });
    });

    app.listen(PORT, function() {
        console.warn(`Node cluster worker ${process.pid} : listening on port :${PORT}`);
    });
}