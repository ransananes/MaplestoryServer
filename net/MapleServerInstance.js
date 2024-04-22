const config = require("../constant.json");
const spawn = require("child_process").spawn;
const thisPath = require("process").cwd;
const { fork } = require("node:child_process")


class MapleServerInstance {
  constructor() {
    this.process = new Map();
    this.addProcess("login")
    this.addProcess("channel");
  }
  
  onData(process, data) {
    if (typeof $jsDebugIsRegistered !== "undefined") return;
    console.log(`[${process}] ${data}`);
  }

  onClose(process, data) {
    this.removeProcess(process);
    console.log(`\x1b[41m[${process}] Process have been closed!.\x1b[40m`);
  }

  onError(process, data) {
    const processArgs = this.process.get(process).spawnargs[2];
    if (process.indexOf("login") === -1) process += processArgs[0];

    if (config.LOG_ERROR) {
      const localDir = "./logs";
      const path = `${localDir}/${process}.txt`;

      if (!fs.existsSync(localDir)) fs.mkdirSync(localDir);

      fs.access(path, (err) => {
        if (err) fs.open(path, "w", () => {});
        const current = new Date();
        const cDate = `${current.getDate()}/${
          current.getMonth() + 1
        }/${current.getFullYear()}`;
        const cTime = `${current.getHours()}:${current.getMinutes()}`;
        fs.appendFile(path, `[${cDate} || ${cTime}] ->> ${data}`, () => {});
      });
    }

    if (typeof $jsDebugIsRegistered !== "undefined") return;
    console.log(`\x1b[31m[${process}] error: ${data}\x1b[37m`);
  }

  getProcess(name) {
    if (!this.process.has(name)) return;
    return this.process.get(name);
  }

  
  addProcess(name){
    const subProcess = fork(`${thisPath()}/net/server/${name}`)
    subProcess.on('message', (msg) => {
      console.log('PARENT got message: ', msg)
      subProcess.send('parent -> child')
    })

    const uniqueID = `${name}-${this.process.size + 1}`;
    this.process.set(uniqueID, subProcess);
    this.getProcess(uniqueID).on("close", this.onClose.bind(this, uniqueID)); // Get process closed.
  }

//   addProcess(name, ...args) {
//     const uniqueID = `${name}-${this.process.size + 1}`;
//     if (this.process.has(uniqueID)) return;
//     console.log(`Child Process: ${uniqueID} Has been spawned.`);
//     const process = spawn("node", [
//       `${thisPath()}/net/server/${name}`,
//       [...args],
//     ]);
//     this.process.set(uniqueID, process);

//     // Process listener
//     this.getProcess(uniqueID).stdout.on(
//       "data",
//       this.onData.bind(this, uniqueID)
//     ); // Get data messages form process.
//     this.getProcess(uniqueID).stderr.on(
//       "data",
//       this.onError.bind(this, uniqueID)
//     ); // Get process error messages.
//   }
  
  removeProcess(name) {
    if (!this.process.has(name)) return;
    this.process.get(name).kill("SIGHUP"); // Send SIGHUP to process.
    this.process.delete(name);
  }
}
module.exports = MapleServerInstance;
