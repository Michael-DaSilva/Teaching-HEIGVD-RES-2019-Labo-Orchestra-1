/*package for UDP datagram*/
var dgram = require('dgram');
/*creation of the socket for the sending of UDP datagram*/
var socket = dgram.createSocket('udp4');
/*package for uuid RFC 4122*/
var UUID = require('uuid/v4');
var uuid = UUID();
/*recovery of the command-line parameters*/
var instrument = process.argv.slice(2);

var error = new Boolean(false);
/*Create a musician via the parameter given by the user*/
function Musicians(instrument, uuid) {
    var sound = "";

    switch (instrument[0]) {
        case 'piano':
            sound = "ti-ta-ti";
            break;
        case 'trumpet':
            sound = "pouet";
            break;
        case 'flute':
            sound = "trulu";
            break;
        case 'violin':
            sound = "gzi-gzi";
            break;
        case 'drum':
            sound = "boum-boum";
            break;
        default:
            console.log('error');
            error = true;
            break;
    }

    /*sending the payload every second to the server*/
    function send() {
        /*content of the JSON payload*/
        var info = {
            uuid: uuid,
            sound: sound,
            /*time of the creation of the UDP packet*/
            activeSince: new Date()
        };
        /*To string for the sending of the message*/
        var payload = JSON.stringify(info);
        var message = new Buffer(payload);
        /*UDP packet sended to the server*/
        socket.send(message,0,message.length,9907,"239.255.22.5");
        console.log(payload);
        /*Time-loop for sending UDP packets every seconds*/
        setTimeout(send, 1000);
    }
    if(!error){
        send();
    }
}

var mus = new Musicians(instrument, uuid);