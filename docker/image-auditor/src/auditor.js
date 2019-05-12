const net = require('net');
const dgram = require('dgram');
const serverUDP = dgram.createSocket('udp4');
/*Map of the musicians that play*/
var played = new Map();
/*Map of the the musicians that play (update of the time)*/
var lastPlayed = new Map();
var message = [];
/*Server UDP*/
serverUDP.bind(9907, function(){
    serverUDP.addMembership("239.255.22.5");
});
/*When receiving a message, the server parse the JSON received and
put the musician in the 2 maps*/
serverUDP.on('message', function(msg){
    var musician = JSON.parse(msg);
    lastPlayed.set(musician.uuid, musician.activeSince);
    /*if the musician is already saved in the list, no need to add it again*/
    if(!(played.has(musician.uuid))){
        played.set(musician.uuid, musician);
    }
});
/*Table of all the active musicians (for TCP server)*/
function viewMusicians(value){
    message.push(JSON.stringify(value));
}
/*Check if a musician is inactive for at least 6 seconds*/
function checkMusicians(){
    /*Time*/
    var now = new Date();
    for(var uuid of lastPlayed.keys()){
        var timeCheck = new Date(lastPlayed.get(uuid));
        if((now.getTime() - timeCheck.getTime()) >= 6000){
            /*If the musician is inactive for more than 6 seconds, it's
            deleted from both maps*/
            lastPlayed.delete(uuid);
            played.delete(uuid);
        }
    }
    /*loop to check every 0.5 seconds*/
    setTimeout(checkMusicians, 500);
}
/*TCP server who create the message for the user*/
var serverTCP = net.createServer(function(socket) {
    played.forEach(viewMusicians);
    socket.write("[" + message.toString() + "]");
    socket.end();
    message = [];
});

checkMusicians();
serverTCP.listen(2205);