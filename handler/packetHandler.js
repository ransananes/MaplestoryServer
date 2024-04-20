const path = require('path');
const fs = require('fs');

// directories to exclude while handling packets
const excludeDirs = require('./handlers/login/auth/excludeDirs');

module.exports = class packetHandler {
    constructor() {
        this._handlers = new Map();
        this._skipedHandelers = new Set();
        this._handlerCount = 0;
    }

    setHandler(opCode, callback) {
        if (this._handlers.has(opCode)) return;
        this._handlers.set(opCode, callback);
        this._handlerCount++;
        console.log(`[PacketHandler] registred new handler for 0x${opCode.toString(16)}`);
    }

    getHandler(opCode) {
        if (this._skipedHandelers.has(opCode)) return (()=>{});
        if (this._handlers.has(opCode)) return this._handlers.get(opCode);
        return this.handlerNotFoundHandler;
    }

    skip(opCode) {
        if (this._skipedHandelers.has(opCode)) return;
        this._skipedHandelers.add(opCode);
        console.log(`[PacketHandler] **Skiped** handler for 0x${opCode.toString(16)}`);
    }

    getHandlerCount() {
        return this._handlerCount;
    }

    handlerNotFoundHandler(client, packet) {
        packet.offset = 0;
        console.log(`Unhandled packet: 0x${packet.readUInt16().toString(16)}`);
        console.log(packet.buffer);
    }

    findJSFiles(directoryPath, files = [], filter) {
        const items = fs.readdirSync(directoryPath);
    
        items.forEach(item => {
            const itemPath = path.join(directoryPath, item);
            const stats = fs.statSync(itemPath);
    
            if (stats.isDirectory()) {
                if (!excludeDirs.includes(item)) {
                    // Recursively search subdirectories
                    this.findJSFiles(itemPath, files, filter);
                }
            } else if (stats.isFile() && path.extname(item) === filter) {
                // Add JavaScript files to the list
                files.push(itemPath);
            }
        });
    
        return files;
    }

    forAllFiles(folder, filter, callback) {
        let files = this.findJSFiles(folder,[],filter);
        files.forEach((file) => {            
            // Check if filename is okay
            console.log(`[Handler-loader] Loading ${file}...`);
            callback(file, path.basename(file));
            console.log(`[Handler-loader] ${file} loaded...`);
        });
    }
};