import {parseHTML} from "./GeniusParser";
import {downloadSong} from "./GeniusAPI";
import {parse} from "acorn";

const id = parseInt(process.argv[2]);
console.log(id);

const song = await downloadSong(id);

/*
const JSON_PREFIX = "window.__PRELOADED_STATE__ =";
let json_line = "";
song.split("\n").every(line => {
		line = line.trim();
		//console.log(line);
		if(line.startsWith(JSON_PREFIX)){
			line = line.slice(JSON_PREFIX.length, line.length);
			//line = "return " + line;

			json_line = line;

			//preloadedData = (new Function(line))();
			return false;
		}
		return true;
	});
*/

const data = await parseHTML(song);

console.log(JSON.stringify(data));

//console.log(json_line);

//const res = parse(json_line, {ecmaVersion: 2020});

//console.log(Object.keys(res));
//console.log(json_line);



process.exit(0);
