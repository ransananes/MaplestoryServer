const { getAuthSuccess } = require("./auth/authFunctions");

packetHandler.setHandler(0x7, async function (client, reader) {
  // check for tos
  console.log("reached tos");
  console.log(client);
  let accepted = reader.readInt8();

  client.acceptTOS(accepted);

  // try login after accepting tos
  const packet = new PacketWriter(0x0000);
  getAuthSuccess(packet, client.client.id);

  client.getSocket().sendPacket(packet);
});
