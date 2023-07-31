var fs = require('fs');

function sendCMSDHeaders(r){
    let staticResponse = '';
    let dynamicResponse = '';

    let requestedHeaders = readRequestedHeaders();

    let dashObjUri = r.variables.args.split('/cmsdValidator')[1].split(' ')[0];

    if(requestedHeaders.includes('at'))
        staticResponse = 'at='   + getRandomInt() + ','
    if(requestedHeaders.includes('br'))
        staticResponse += 'br='  + getRandomInt() + ','
    if(requestedHeaders.includes('ht'))
        staticResponse += 'ht='  + getRandomInt() + ','
    if(requestedHeaders.includes('n,'))
        staticResponse += 'n='   + '"Intermediary_' + getRandomString() + '",'
    if(requestedHeaders.includes('nor'))
        staticResponse += 'nor="' + getRandomString() + '|'  + getRandomString() + '|' + getRandomString() + '",'
    if(requestedHeaders.includes('nrr'))
        staticResponse += 'nrr=' + getRandomInt() + '-' + getRandomInt() + '|' + getRandomInt() + '-' + getRandomInt() + '|' + getRandomInt() + '-' + getRandomInt() + ','
    if(requestedHeaders.includes('#d,'))
        staticResponse += 'd='   + getRandomInt() + ','
    if(requestedHeaders.includes('ot'))
        staticResponse += 'ot='  + getRandomObjectType() + ','
    if(requestedHeaders.includes('su'))
        staticResponse += 'su='  + getRandomBool() + ','
    if(requestedHeaders.includes('st'))
        staticResponse += 'st='  + getRandomStreamingType() + ','
    if(requestedHeaders.includes('sf'))
        staticResponse += 'sf='  + getRandomStreamingFormat() + ','
    if(requestedHeaders.includes('v'))
        staticResponse += 'v='   + getRandomInt()

    dynamicResponse = '"CDN_:'   + getRandomString() + '";'
    if(requestedHeaders.includes('du'))
        dynamicResponse += 'du='     + getRandomBool() + ';'
    if(requestedHeaders.includes('etp'))
        dynamicResponse += 'etp='    + getRandomInt() + ';'
    if(requestedHeaders.includes('mb'))
        dynamicResponse += 'mb='     + getRandomInt() + ';'
    if(requestedHeaders.includes('rd'))
        dynamicResponse += 'rd='     + getRandomInt() + ';'
    if(requestedHeaders.includes('rtt'))
        dynamicResponse += 'rtt='    + getRandomInt()


    function done(res) {
        r.headersOut['CMSD-Dynamic'] = dynamicResponse;
        r.headersOut['CMSD-Static'] = staticResponse;
        r.return(res.status, res.responseBody);
    }
    r.subrequest(dashObjUri, r.variables.args, done);
    r.finish();
}


function readRequestedHeaders(){
    return fs.readFileSync('/home/dominik/Uni/AWT/cmsd-validator/setCmsdHeaders.txt')
}

function writeRequestedHeaders(r){
    try {
        fs.writeFileSync('/home/dominik/Uni/AWT/cmsd-validator/setCmsdHeaders.txt', JSON.stringify(r.requestText));
    } 
    catch (e) {
        console.log(e);
    }

    r.return(200, '');
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

export default { sendCMSDHeaders, writeRequestedHeaders };

