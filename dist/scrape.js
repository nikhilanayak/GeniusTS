import { parseHTML } from "./GeniusParser.js";
import { downloadSong, DEBUG_INFO } from "./GeniusAPI.js";
import zlib from "zlib";
import util from "util";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
const BUCKET_SIZE = 4096;
const deflate = util.promisify(zlib.deflate);
DEBUG_INFO.DEBUG = false;
const id = parseInt(process.argv[2]);
async function write(id, text) {
    //const path = `/mnt/c/Users/Nikhi/Desktop/Programming/GeniusTS/data/${id}.json`;
    const bucket = Math.floor(id / BUCKET_SIZE);
    const path = `data/${bucket}/${id}.json`;
    if (!existsSync(`data/${bucket}`)) {
        try {
            mkdirSync(`data/${bucket}`);
        }
        catch (err) {
        }
    }
    const compressed = text;
    writeFileSync(path, compressed);
}
const song = await downloadSong(id);
console.log();
console.log(song);
console.log();
if (song == "500") {
    execSync("./event_handler.sh CLOUDFLARE_ERR");
}
if (song == "404") {
    //await write(id, "CF_ERR");
    process.exit(0);
}
else {
    const data = await parseHTML(song);
    await write(id, JSON.stringify(data));
    process.exit(0);
}
