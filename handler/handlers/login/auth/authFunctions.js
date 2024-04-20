// authFunctions.js

// Declare a function to send a packet based on the login result
function sendPacketBasedOnLoginResult(client, packet, resultCode) {
    if (resultCode === 0) {
      getAuthSuccess(packet, client.info);
    } else {
      getAuthFailed(packet, resultCode);
    }
    client.getSocket().sendPacket(packet);
  }
  
  function getAuthSuccess(packet, account) {
    packet.writeUInt32(0); // status OK
    packet.writeUInt16(0);
  
    const numToHex = parseInt(String(account.id).substr(0, 8), 16); // max length 8, parse to base 16.
    packet.writeUInt32(numToHex);
    packet.writeUInt8(0);
    packet.writeUInt8(0); // Admin flag
    packet.writeUInt8(0);
    packet.writeUInt8(0);
    packet.writeString(account.username);
    packet.writeUInt8(0);
    packet.writeUInt8(0); // muteReason
    packet.writeUInt64(0); // muteResetDate
    packet.writeUInt64(0); // creationDate
    packet.writeUInt32(0);
    // PIC info
    packet.writeUInt8(0);
    packet.writeUInt8(0);
  }
  
  function getAuthFailed(packet, reason) {
    /**
     * reason:
     *  0: Correct data, getAuthSuccess
     *  3: ID deleted or blocked
     *  4: Incorrect password
     *  5: Not a registered id
     *  6, 8, 9: System error
     *  7: Already logged in
     *  10: Cannot process so many connections
     *  11: Only users older than 20 can use this channel
     *  13: Unable to log on as master at this ip
     *  14, 17: Wrong gateway or personal info and weird korean button
     *  16, 21: Please verify your account through email...
     *  23: License agreement
     */
    packet.writeUInt16(reason); // 4 invaild password || 7 already loggedin
    packet.writeUInt32(0);
  }
  
  function getPermBan(packet, reason) {
    packet.writeUInt16(2); // is banned
    packet.writeUInt32(0);
    packet.writeUInt8(reason); // without reason.
    packet.writeDate(0); // infinity
  }
  
  function getTempBan(packet, timestampTill, reason) {
    packet.writeUInt16(2); // is banned
    packet.writeUInt32(0);
    packet.writeUInt8(reason);
    packet.writeDate(timestampTill);
  }
  
module.exports = {sendPacketBasedOnLoginResult, getAuthSuccess, getAuthFailed, getPermBan, getTempBan };