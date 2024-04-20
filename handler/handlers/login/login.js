const { sendPacketBasedOnLoginResult } = require("./auth/authFunctions");

packetHandler.setHandler(0x0001, async (client, reader) => {
  // LOGIN_PASSWORD
  const username = reader.readString();
  const password = reader.readString();
  const packet = new PacketWriter(0x0000);

  // Handle the login attempt
  try {
    const loginOk = await client.getUserFromDB(
      username,
      password,
      config.AUTO_REGISTER
    );
    sendPacketBasedOnLoginResult(client, packet, loginOk);
  } catch (exception) {
    sendPacketBasedOnLoginResult(client, packet, 25); // 25 indicates an exception occurred
  }
});
