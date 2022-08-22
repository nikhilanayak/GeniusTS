delete process.env['http_proxy'];
delete process.env['HTTP_PROXY'];
delete process.env['https_proxy'];
delete process.env['HTTPS_PROXY'];

import {parseHTML} from "./GeniusParser";
import {downloadSong} from "./GeniusAPI";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import {BATCH_SIZE} from "./Params";
import axios from "axios";
import zlib from "zlib";
import { PromisePool } from "@supercharge/promise-pool";

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);


function writeJSON(fname: string, obj: any): void{
	const str = JSON.stringify(obj);
	const cStr = zlib.gzipSync(str);

	writeFileSync(fname + ".gz", cStr);
	writeFileSync(fname, str);
}

let URL = "http://localhost:4422/chunk";

async function getBatch(){
	while(true){
		try{
			const res = await fetch(URL);
			const resNum = parseInt(await res.text());
			return resNum;
		}
		catch(err){
			console.error(err);
		}
	}
	//return range(0, 128, 1);
}

async function runBatch(){
	const batchOff = await getBatch();
	const batch = range(batchOff, batchOff + BATCH_SIZE, 1);

	const results = [];

	let done = 0;
	for(let id of batch){
		const song = await downloadSong(id);
		const res = await parseHTML(song);
		//console.log(done++, "/", batch.length);
		results.push(res);
	}

	return [results, batchOff];
}


while(true){
	const [res, offset] = await runBatch();

	writeJSON(`/dev/shm/data/${offset}.json`, res);
}

