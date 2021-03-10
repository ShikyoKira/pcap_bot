const privateip = '<PRIVATE IP>';
const steamkey = '<STEAM_WEB_API_KEY>';
const jobebotpath = '<PATH_TO_JOBE_BOT>';

const pcap = require("pcap");
const pcap_session = pcap.createSession("ens4", { filter : `src not ${privateip} and port 2456` });
const matcher = /steamid:([0-9]+)/i;
const lostmatcher = /Application closed connection/i;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;    
const { exec } = require('child_process');
const playerlistpath = `${jobebotpath}/playerlist/`;
const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamkey}&steamids=`;

var ipmap = new Map();

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = 'json';    
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

console.log("Listening on " + pcap_session.device_name);

pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet),
        data = packet.payload.payload.payload.data;
    
    if (!data) {
	return;
    }

    let bytes = data.toString();
    let found = bytes.match(matcher);

    if (found) {
	const ip = packet.payload.payload.saddr.toString();
	var resp = httpGet(url + found[1]);
	var name = resp.response.players[0].personaname;
	ipmap.set(ip, name);
	exec(`cat > "${playerlistpath}online/${name}"`);
        exec(`rm "${playerlistpath}offline/${name}"`);
	exec(`node ~/notify_bot/index.js "*${name}* has connected"`);
	return;
    }

    found = bytes.match(lostmatcher);

    if (!found) {
	return;
    }

    const ip = packet.payload.payload.saddr.toString();

    if (!ipmap.has(ip)) {
	return;
    }

    name = ipmap.get(ip);
    exec(`cat > "${playerlistpath}offline/${name}"`);
    exec(`rm "${playerlistpath}online/${name}"`);
    exec(`node ~/notify_bot/index.js "*${name}* has disconnected"`);
    ipmap.delete(ip);
});
