const MapleServerInstance = require("./net/MapleServerInstance");
const MapleServer = require("./net/MapleServer");
const PacketHandler = require("./handler/PacketHandler");

// instances: server
//           /    \
//         login  channel
//                  \
//                 / \
//                 channels

//const data = new MapleServer();
const packets = new PacketHandler();
const Instances = new MapleServerInstance();

