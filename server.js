//dependencies
let http = require('http');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;

//file dependencies
let config = require('./libs/config');
let handlers = require('./libs/handlers');
let db = require('./libs/db');


let server = http.createServer(function(req, res) {

    //CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

    // parse url and get path
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, ''); //обрезаем '/' вначале и в конце url запроса

    // get QUERY string as OBJECT
    let queryStringObject = parsedUrl.query;

    // http method 
    let method = req.method.toLowerCase();

    // get HEADERS as OBJECT
    let headers = req.headers;

    // get payloads if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        //construct data OBJECT to send to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : JSON.parse(buffer) 
        }

        //choose handler for request. 
        let chosenHandler = router[trimmedPath];

        chosenHandler(data, function(statusCode, errorObject, responceData) {
            res.setHeader('Content-Type', 'application/json'); 
            if (errorObject) {
                //return error
                let serverResponceError = JSON.stringify(errorObject);
                res.writeHead(statusCode);
                res.end(`error ${statusCode}: ${serverResponceError}`);
                console.log(`error ${statusCode}: ${serverResponceError}`);
            } else if (responceData) {
                //return data to client side
                let serverResponceData = JSON.stringify(responceData);
                res.writeHead(statusCode);
                res.end(serverResponceData);
                console.log(`data was sent ${statusCode}: ${serverResponceData}`);
            } else { 
                //return the responce
                res.writeHead(statusCode);
                res.end(`responce ${statusCode}`);
                console.log(`responce ${statusCode}`);
            }
        });
    });
});

server.listen(config.port, function() { 
    console.log(`server is listening @ port: ${config.port} in ${config.envName} mode` );
});


//connect to DB when staring up server
db.connect;


//routing
let router = {
'register' : handlers.register,
'login' : handlers.login,
'apps' : handlers.getAppointments,
'createApp' : handlers.createApp,
'deleteApp' : handlers.deleteApp
}

