const { connectSQL } = require("./sql/sqlConnection");
const nx = require("../provider/nx");

// singleton pattern
class MapleServer {
  constructor() {
    this.sqlConnection = connectSQL();
    this.DataFiles = {
      character: new nx.file(`${__dirname}/../provider/nx/Character.nx`),
      item: new nx.file(`${__dirname}/../provider/nx/Item.nx`),
      string: new nx.file(`${__dirname}/../provider/nx/String.nx`),
      map: new nx.file(`${__dirname}/../provider/nx/Map.nx`),
      mob: new nx.file(`${__dirname}/../provider/nx/Mob.nx`),
      npc: new nx.file(`${__dirname}/../provider/nx/Npc.nx`),
      skill: new nx.file(`${__dirname}/../provider/nx/Skill.nx`),
      reactor: new nx.file(`${__dirname}/../provider/nx/Reactor.nx`),
      etc: new nx.file(`${__dirname}/../provider/nx/Etc.nx`),
    };
  }
  static getInstance() {
    if (!MapleServer.instance) {
      MapleServer.instance = new MapleServer();
    }
    return MapleServer.instance;
  }
  static getSQL() {
    return this.sqlConnection;
  }
}

module.exports = MapleServer;
