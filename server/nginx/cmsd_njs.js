var querystring = require('querystring');
var fs = require('fs');

var LOGFILE = 'home/dominik/Uni/AWT/cmsd-validator/cmsd.log'; 

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
    writeLog("in sendCMSDHeaders");

    let staticResponse
    let dynamicResponse

    let dashObjUri = r.variables.args.split('/cmsdValidator')[1].split(' ')[0];

    staticResponse = 'at=' + '12345' + ','
    staticResponse += 'br=' + '12345' + ','
    staticResponse += 'ht=' + '12345' + ','
    staticResponse += 'n=' + 'Intermediary Identifier' + ','
    staticResponse += 'nor=' + 'path|' + ','
    staticResponse += 'nrr=' + 'start-end|' + ','
    staticResponse += 'd=' + '12345' + ','
    staticResponse += 'ot=' + 'v' + ','
    staticResponse += 'su=' + 'FALSE' + ','
    staticResponse += 'st=' + 'v' + ','
    staticResponse += 'sf=' + 'd' + ','
    staticResponse += 'v=' + '12345'

    dynamicResponse = '"Identifier";'
    dynamicResponse += 'du=' + 'TRUE' + ';'
    dynamicResponse += 'etp=' + '12345' + ';'
    dynamicResponse += 'mb=' + '12345' + ';'
    dynamicResponse += 'rd=' + '12345' + ';'
    dynamicResponse += 'rtt=' + '12345'


    function done(res) {
        r.headersOut['CMSD-Dynamic'] = dynamicResponse;
        r.headersOut['CMSD-Static'] = staticResponse
        r.return(res.status, res.responseBody);
    }
    r.subrequest(dashObjUri, r.variables.args, done);
    r.finish();
}

// Note: We need to add the function to nginx.conf file too for HTTP access
export default { sendCMSDHeaders };

