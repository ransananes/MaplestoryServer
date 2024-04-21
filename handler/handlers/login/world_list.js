const PacketHandler = require('../../PacketHandler');
const PacketWriter = require("../../../net/MapleWriter");

const SendOpcode = {
  SERVERSTATUS: 0x0003,
  SERVERLIST: 0x000a,
};

const showWorlds = function (client, reader) {
  let packetCollector;
  const defaultFlag = 0; // Display type of flag on world name.
  const charCreateStatus = 0; // Disable creation of character in world (true/false).
  packetCollector = new PacketWriter(SendOpcode.SERVERLIST);
  packetCollector.writeUInt8(0);
  packetCollector.writeString("Scania");
  packetCollector.writeUInt8(defaultFlag);
  packetCollector.writeString("test");
  packetCollector.writeUInt16(1); // EXP Rate
  packetCollector.writeUInt16(1); // DROP Rate
  packetCollector.writeUInt8(charCreateStatus);

  packetCollector.writeUInt8(1);
  for (let i = 1; i <= 1; i++) {
    packetCollector.writeString(`${"Scania"}-${i}`); // (Server Name - Channel ID)
    packetCollector.writeUInt32(
      (require("os").totalmem / 1024 ** 2 - require("os").freemem / 1024 ** 2) /
        10 ** i
    ); // Count online players
    packetCollector.writeUInt8(0); // World id
    packetCollector.writeUInt16(i - 1); // Channel id
  }

  const dialogs = []; // idk?
  packetCollector.writeUInt16(dialogs.length);
  for (let j = 0; j < dialogs.length; j++) {
    const dialog = dialogs[j];
    packetCollector.writeUInt16(dialog.x);
    packetCollector.writeUInt16(dialog.y);
    packetCollector.writeString(dialog.text);
  }
  client.getSocket().sendPacket(packetCollector);

  // End of server list.
  packetCollector = new PacketWriter(SendOpcode.SERVERLIST);
  packetCollector.writeUInt8(0xff);
  client.getSocket().sendPacket(packetCollector);
};
PacketHandler.getInstance().setHandler(0x000b, showWorlds); // SERVERLIST_REQUEST
PacketHandler.getInstance().setHandler(0x0004, showWorlds); // SERVERLIST_REREQUEST

PacketHandler.getInstance().setHandler(0x0006, function (client, reader) {
  // SERVERSTATUS_REQUEST
  const packet = new PacketWriter(SendOpcode.SERVERSTATUS);
  /**
   * status:
   * 0 - Normal
   * 1 - Highly populated
   * 2 - Full
   */
  packet.writeUInt16(0); // Status of the world.
  client.getSocket().sendPacket(packet);
});
