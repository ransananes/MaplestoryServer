const server = require('../server');
const PacketHandler = require('../../handler/PacketHandler');
const PacketWriter = require('../MapleWriter');
const PacketReader = require('../MapleReader');
const config = require('../../constant.json');
const mysql = require('mysql');
const nx = require('../../provider/nx');
const MapleMap = require('../../client/MapleMap');

const localServer = class MapleChannel {
    constructor(args) {
        this.name = 'channel';
        this.port = 7575;
        this.clients = new Map();
        this.server = new server(this.name, this.port, this.clients);
        PacketHandler.getInstance().forAllFiles(`${process.cwd()}\\handler\\handlers\\${this.name}\\`, '.js', fileName => require(fileName));
    }

    pinger() {
        PacketHandler.getInstance().setHandler(0x0018, client => { /// PONG
            client.responseTime = new Date().getTime()
            client.ponged = true;
        });
        return setInterval(() => { // PING
            const clients = (this.server.clients || this.clients);
            if(clients.size <= 0) return;
            for (const [socket, client] of clients) {
                const now = new Date().getTime();
                const resSecTimeLimit = 150; // 2.5 min to response
                const packet = new PacketWriter(0x0011);
                if (typeof client.responseTime === 'number') { // Disconnect slow connection players.
                    if ((now - client.responseTime) >= (resSecTimeLimit * 1000)) {
                        client.disconnect('Ping timeout');
                        this.server.clients.delete(socket);
                    }
                } else {
                    client.responseTime = now;
                }
                if (client.ponged !== 'undefined') { // Disconnect crashed players.
                    if (client.ponged === false) {
                        client.disconnect('Ping timeout');
                        this.server.clients.delete(socket);
                    }
                }
                client.ponged = false;
                socket.sendPacket(packet);
            }
        }, 15000); // Check every 15 sec if player response.
    }


}

const serverChannel = new localServer(process.argv[2].split(','));
serverChannel.pinger();