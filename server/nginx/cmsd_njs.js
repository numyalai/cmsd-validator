var querystring = require('querystring');
var fs = require('fs');

var LOGFILE = '/home/sultan/school_projects/cmsd-validator/cmsd.log';

function writeLog(msg) {
    //var dateTime = new Date().toLocaleString();
    var logLine = ('\n' + msg);
    try {
        fs.appendFileSync(LOGFILE, logLine);
    } catch (e) {
        return e;
        // unable to write to file
    }
}

function sendCMSDHeaders(r){

    let staticResponse
    let dynamicResponse

    let dashObjUri = r.variables.args.split('/cmsdValidator')[1].split(' ')[0];

    staticResponse = 'at='   + getRandomInt() + ','
    staticResponse += 'br='  + getRandomInt() + ','
    staticResponse += 'ht='  + getRandomInt() + ','
    staticResponse += 'n='   + 'Intermediary_' + getRandomString() + ','
    staticResponse += 'nor=' + getRandomString() + '|'  + getRandomString() + '|' + getRandomString() + ','
    staticResponse += 'nrr=' + getRandomInt() + '-' + getRandomInt() + '|' + getRandomInt() + '-' + getRandomInt() + '|' + getRandomInt() + '-' + getRandomInt() + ','
    staticResponse += 'd='   + getRandomInt() + ','
    staticResponse += 'ot='  + getRandomObjectType() + ','
    staticResponse += 'su='  + getRandomBool() + ','
    staticResponse += 'st='  + getRandomStreamingType() + ','
    staticResponse += 'sf='  + getRandomStreamingFormat() + ','
    staticResponse += 'v='   + 'abc' //getRandomInt()

    dynamicResponse = '"CDN_:' + getRandomString() + '";'
    dynamicResponse += 'du='     + getRandomBool() + ';'
    dynamicResponse += 'etp='    + getRandomInt() + ';'
    dynamicResponse += 'mb='     + getRandomInt() + ';'
    dynamicResponse += 'rd='     + getRandomInt() + ';'
    dynamicResponse += 'rtt='    + getRandomInt()


    function done(res) {
        r.headersOut['CMSD-Dynamic'] = dynamicResponse;
        r.headersOut['CMSD-Static'] = staticResponse;
        r.return(res.status, res.responseBody);
    }
    r.subrequest(dashObjUri, r.variables.args, done);
    r.finish();
}

function getRandomInt(){
    return Math.floor(Math.random() * 10000) + 1;
}

function getRandomObjectType(){
    let types = ['m', 'a', 'v', 'av', 'i', 'c', 'tt', 'k' ,'o'];
    let i = Math.floor(Math.random() * types.length);

    return types[i];
}

function getRandomStreamingType(){
    let types = ['v', 'l'];
    let i = Math.floor(Math.random() * types.length);

    return types[i];
}

function getRandomStreamingFormat(){
    let formats = ['d', 'h', 's', 'o'];
    let formatsString = '(';

    for(let i = 0 ; i <= Math.floor(Math.random() * formats.length); i++){
        let j = Math.floor(Math.random() * (formats.length));
        formatsString += formats.splice(j, 1) + ' ';
    }

    return (formatsString.slice(0, -1)) + ')';
}

function getRandomBool(){
    let bool = ['true', 'false'];
    let i = Math.floor(Math.random() * bool.length);

    return bool[i];
}

function getRandomString(){
    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let string = '';

    for(let i = 0; i <= Math.floor(Math.random() * (characters.length)); i++){
        string += characters.charAt(Math.random() * (characters.length));
    }
    
    return string;
}

// Note: We need to add the function to nginx.conf file too for HTTP access
export default { sendCMSDHeaders };

