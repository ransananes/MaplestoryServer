const PacketHandler = require("../../PacketHandler");
const PacketWriter = require("../../../net/MapleWriter");
const { sendPacketBasedOnLoginResult } = require("./auth/authFunctions");
const MapleServer = require("../../../net/MapleServer");

PacketHandler.getInstance().setHandler(0x0001, async (client, reader) => {
  // LOGIN_PASSWORD
  const username = reader.readString();
  const password = reader.readString();
  const packet = new PacketWriter(0x0000);

  // Handle the login attempt
  try {
    const loginOk = await client.getUserFromDB(username, password);
    sendPacketBasedOnLoginResult(client, packet, loginOk);
  } catch (exception) {
    sendPacketBasedOnLoginResult(client, packet, 25); // 25 indicates an exception occurred
  }
});
