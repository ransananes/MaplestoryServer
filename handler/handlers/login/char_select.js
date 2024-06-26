const PacketHandler = require('../../PacketHandler');
const PacketWriter = require('../../../net/MapleWriter');
const MapleServerInstance = require('../../../net/MapleServerInstance');

function EnterChannel(client, character) {
    const world = client.getWorld();
    let localPort = 7575;

    // Remote-hack vulnerable
    const packet = new PacketWriter(0x007D);
    packet.writeInt8(1);
    packet.writeInt8(1);
    packet.writeUInt32(character.id);
    character.addStats(packet);
    character.addAvatar(packet);
    console.log("Entering channel");
    // process.send(client);
    //process.send("CHILD TO PAPA -> TEST");
    client.getSocket().sendPacket(packet);
}

// Select character
PacketHandler.getInstance().setHandler(0x0013, async function (client, reader) {
    if (!client.account || !client.account.username) {
		client.disconnect();
		return;
	}
    const characterId = reader.readUInt32();
    const macAddr = reader.readString();
    const macAddrNoDashes = reader.readString();
    const character = await client.getSingleCharacterFromDB(characterId);
    client.character = character;
    EnterChannel(client, character);
});


PacketHandler.getInstance().setHandler(0x001E, async function (client, reader) {
    // Select character using PIC

    const pic = reader.readString();
    const characterId = reader.readUInt32();
    const macAddr = reader.readString();
    const macAddrNoDashes = reader.readString();

    EnterChannel(client, character);
});
