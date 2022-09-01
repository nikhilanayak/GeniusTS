import { parseHTML } from "./GeniusParser.js";
import { downloadSong, DEBUG_INFO } from "./GeniusAPI.js";
import zlib from "zlib";

async function run(id: number){
    DEBUG_INFO.DEBUG = false;

    //const id = parseInt(process.argv[2]);
    //console.log(id);
    const song = await downloadSong(id);


    if (song == "404" || song == "500") {
        //errExit();
        return "err";
    }


    const data = await parseHTML(song);

    //console.log(JSON.stringify(data));
    return data;

    //console.log(JSON.stringify(data));

    //console.log(json_line);

    //const res = parse(json_line, {ecmaVersion: 2020});

    //console.log(Object.keys(res));
    //console.log(json_line);



    //process.exit(0);
}
export default run;