var HTTPS = require('https');

function sendReq(options, body ){
 
    return new Promise(function(resolve, reject) {
        var req = HTTPS.request(options, (res) => {
            if(res.statusCode < 200 || res.statusCode >= 300){
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var data = '';
            console.log(`STATUS: ${res.statusCode}`);
            res.on('data', (chunk) => {
                //console.log(`BODY: ${chunk}`);
                data += chunk;
            });
            res.on('end', () => {
                //console.log("No more data!");
                try{
                    data = JSON.parse(data);

                }catch(e){
                    reject(e);
                }
                resolve(data);
            });
        });

        //reject on request error
        req.on('error', function(err) {
            console.log('error with request ' + JSON.stringify(err));
            reject(err);
        });
        req.on('timeout', function(err){
            console.log('timeout with request ' + JSON.stringify(err));
            reject(err);
        });
        if(body){
            req.end(JSON.stringify(body));
        }else{
            req.end();
        }
        
    });

}

function getChannels(botAuth){ 
    var options;

    options = {
        hostname: 'www.slack.com',
        path: '/api/channels.list',
        method: 'GET',
        headers: {
            'Authorization': botAuth,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    sendReq(options);
}

function botPostMessage(message, botAuth){
    var options, body;
    options = {
        hostname: 'www.slack.com',
        path: '/api/chat.postMessage',
        method: 'POST',
        headers: {
            'Authorization': botAuth,
            'Content-Type': 'application/json',
        }
    };
    body = {
        'channel': 'CB5R6F1K6',
        'text': message
    };
    sendReq(options, body).then(function(data) {
        console.log(data);
    });
}

//Test API runs the first test API method to verify if things are running properly (for personal experience, not necessary at all)
function testAPI(auth){
    var options, x;
    x = '';

    options = {
        hostname: 'www.slack.com',
        path: '/api/api.test',
        method: 'POST',
        auth: 'Authorization: '+ auth,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    sendReq(options).then(function(body) {
        console.log(body.ok);
        x = body.ok;
        console.log("testing variable from in the scope: " + x);
    });
    
    //this gets called before the variable x can be filled due to normal NodeJS asynchronous flow
    // console.log("testing variable from outside the scope: " + x);
}


module.exports = botPostMessage;