const MapleServerInstance = require("./net/MapleServerInstance");
const MapleServer = require("./net/MapleServer");

// instances: server
//           /    \
//         login  channel
//                  \
//                 / \
//                 channels

const data = new MapleServer();
const Instances = new MapleServerInstance();

