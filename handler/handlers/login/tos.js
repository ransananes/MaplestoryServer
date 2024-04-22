const PacketHandler = require('../../PacketHandler');
const PacketWriter = require('../../../net/MapleWriter');


const { getAuthSuccess } = require("./auth/authFunctions");

PacketHandler.getInstance().setHandler(0x7, async function (client, reader) {
  // check for tos
  console.log("reached tos");
  let accepted = reader.readInt8();

  client.acceptTOS(accepted);

  // try login after accepting tos
  const packet = new PacketWriter(0x0000);
  console.log(client);
  getAuthSuccess(packet, client.account.id);

  client.getSocket().sendPacket(packet);
});
