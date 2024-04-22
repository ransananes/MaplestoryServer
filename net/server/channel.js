const Server = require('../Server');
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
        console.log("Starting new server ~ channel");
        this.port = 7575;
        this.clients = new Map();
        this.server = new Server(this.name, this.port, this.clients);
    }

    pinger() {
        PacketHandler.getInstance().setHandler(0x0018, client => { /// PONG
            client.responseTime = new Date().getTime()
            client.ponged = true;
        });
        return setInterval(() => {
            // PING
            const clients = this.server.clients || this.clients;
            if (clients.size <= 0) return;
            for (const [socket, client] of clients) {
              const now = new Date().getTime();
              const resSecTimeLimit = 150; // 2.5 min to response
              const maxNonResponses = 5; // Adjust this to change the number of non-responses allowed
              const packet = new PacketWriter(0x0011);
      
              if (typeof client.responseTime === "number") {
                // Disconnect slow connection players.
                if (now - client.responseTime >= resSecTimeLimit * 1000) {
                  client.disconnect("Ping timeout 1 ");
                  this.server.clients.delete(socket);
                }
              } else {
                client.responseTime = now;
              }
      
              if (client.numNonResponses === undefined) {
                client.numNonResponses = 0;
              }
              // TODO: add server send packets instead of waiting for client to prevent afks crash
              if (client.ponged !== "undefined") {
                // Disconnect crashed players.
                if (client.ponged === false) {
                  client.numNonResponses++;
                  if (client.numNonResponses >= maxNonResponses) {
                    client.disconnect("Ping timeout 2");
                    this.server.clients.delete(socket);
                  }
                } else {
                  client.numNonResponses = 0;
                }
              }
      
              client.ponged = false;
              socket.sendPacket(packet);
            }
          }, 10000); // Check every 15 sec if player response.
    }


}
const serverChannel = new localServer();
serverChannel.pinger();