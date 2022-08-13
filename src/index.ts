import {parseHTML} from "./GeniusParser";
import {downloadSong} from "./GeniusAPI";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import {BATCH_SIZE} from "./Params";
import axios from "axios";



function writeJSON(fname: string, obj: Record<any, any>): void{
	writeFileSync(fname, JSON.stringify(obj));
}

let URL = "http://ur.l/chunk";


if(!existsSync("data")){
	mkdirSync("data");
}

while(true){
	try{
		const offset = parseInt((await axios.get(URL)).data);

		const promises = [];

		for(let id = offset; id < offset + BATCH_SIZE; id++){
			promises.push(downloadSong(id));
		}
		const res = await Promise.all(promises);

		writeJSON(`data/${offset}.json`, res);
		console.log(offset);
	}
	catch(err){
		console.error(err);
	}
}