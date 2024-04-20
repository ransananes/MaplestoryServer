packetHandler.setHandler(0x0005, async function (client, reader) { // CHARLIST_REQUEST
    //if (reader.readUInt8() !== 2) return;
    reader.readUInt8()
    let worldid = reader.readUInt8();
    let channelid = reader.readUInt8();
    client.setWorld(worldid);
    client.setChannel(channelid);
    const isGM = false;
    const viewingAll = false;
    const characters =  await client.getCharactersFromDB();
    const packet = new PacketWriter(0x000B);
    // if (client.getChannel() > config.CHANNELS_TO_LOAD || client.getChannel() < 0 || isNaN(client.getWorld())) {
    //     packet.writeUInt8(8);
    //     client.getSocket().sendPacket(packet);
    //     return;
    // }

    packet.writeUInt8(channelid);
    packet.writeUInt8(characters.length); // character count
    for (let i = 0; i < characters.length; i++) { // character count
        const character = characters[i];
        packet.writeUInt32(character.id);
        character.addStats(packet);
        character.addAvatar(packet);
    }
    packet.writeUInt8(Number(!config.ENABLE_PIC)); // PIC registered
    packet.writeUInt32(client.account.characterslots); // Max Characters
    client.getSocket().sendPacket(packet);
});