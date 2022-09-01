import { parseHTML } from "./GeniusParser.js";
import { downloadSong, DEBUG_INFO } from "./GeniusAPI.js";
import zlib from "zlib";
import util from "util";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const BUCKET_SIZE = 4096;

const deflate = util.promisify(zlib.deflate);

DEBUG_INFO.DEBUG = false;
const id = parseInt(process.argv[2]);


async function write(id: number, text: string) {
    //const path = `/mnt/c/Users/Nikhi/Desktop/Programming/GeniusTS/data/${id}.json`;
    const bucket = Math.floor(id / BUCKET_SIZE);
    const path = `data/${bucket}/${id}.json`;

    if(!existsSync(`data/${bucket}`)){
        try{
            mkdirSync(`data/${bucket}`);
        }
        catch(err){

        }
    }

    //const compressed = await deflate(text);
    const compressed = text;

    writeFileSync(path, compressed);
}

const song = await downloadSong(id);

if (song == "404" || song == "500") {
    //await write(id, "");
    await write(id, "CF_ERR");
    //errExit();
    process.exit(0);
    //"err";
}

else {

    const data = await parseHTML(song);

    await write(id, JSON.stringify(data));

    process.exit(0);

}
