const MapleLife = require("../../../client/MapleLife");
const { getMap } = require("../../../client/MapleMap");
const PacketHandler = require("../../PacketHandler");
const PacketWriter = require("../../../net/MapleWriter");

PacketHandler.getInstance().setHandler(0x00df, function (client, reader) {
  console.log("player update, op code :223");
});

// handle player movement
PacketHandler.getInstance().setHandler(0x0029, async function (client, reader) {
  //const portal = reader.readUInt8();
  reader.skip(9); // unique value per-map?
  reader.skip(1); // skip another one

  const MovableLife = new MapleLife();

  const movePath = MovableLife.decodeMovePath(reader, false);
  if (movePath.length === 0) {
    console.log("Empty move path")
    // client.disconnect("Empty move path");
    return;
  } else {
    client.getPlayer().location.x = MovableLife.x;
    client.getPlayer().location.y = MovableLife.y;
    client.getPlayer().location.stance = MovableLife.stance;
    client.getPlayer().location.foothold = MovableLife.foothold;
  }

  const packet = new PacketWriter(0x00b9);
  packet.writeUInt32(client.getPlayer().id);
  MovableLife.encodeMovePath(movePath, packet);
  getMap(client.getPlayer().mapId).broadcastPacket(packet, client);
});

// handle player movement
PacketHandler.getInstance().setHandler(0x00cf, async function (client, reader) {
    console.log("something with movement")
  });