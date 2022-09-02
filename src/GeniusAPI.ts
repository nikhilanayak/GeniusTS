import { parse } from "fast-html-parser";
import { existsSync, readFileSync } from "fs";
import https from "https";
import fetch from "node-fetch";
import { AbortController } from "node-abort-controller";

const PROTO = "https";

export const DEBUG_INFO = {
	DEBUG: false,
	ingress: 0,
	cache: true
};

function trackIngress(text: string){
	DEBUG_INFO.ingress += Buffer.byteLength(text, "utf-8");
}

process.on("exit", () => {
	if(DEBUG_INFO.DEBUG){
		console.error("DEBUG: " + `INGRESS: ${DEBUG_INFO.ingress} bytes`);
		console.error("DEBUG: " + `UPTIME: ${process.uptime()}`);
	}
});



async function myFetch(url: string) {
	const TIMEOUT_SEC = 30;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort, TIMEOUT_SEC * 1000);
	try{
		return await fetch(url, { signal: controller.signal });
	}
	catch(err){
		return {
			ok: false,
			status: 999, // not 404 but also not 500
			text: async () => ""
		}
	}
}

export async function downloadAnnotation(id: number, retry = 5): Promise<[string, string]> {
	if (retry == 0) return null;

	const res = await myFetch(`${PROTO}://genius.com/${id}`);

	if (!res.ok) {
		if (res.status == 404) {
			return null;
		}
		return await downloadAnnotation(id, retry - 1);
	}

	const data = await res.text();

	DEBUG_INFO.DEBUG && trackIngress(data);

	const page = parse(data);

	const metas = page.querySelectorAll("meta");

	const referent = metas.filter(i => i.attributes.property == "rap_genius:referent")?.[0]?.attributes?.content;
	const description = metas.filter(i => i.attributes.property == "og:description")?.[0]?.attributes?.content;


	return [referent, description];



}

export async function downloadSong(id: number, retry = 5): Promise<string> | null {
	if (retry == 0) return null;

	const res = await myFetch(`${PROTO}://genius.com/songs/${id}`);// || {ok: false, status: 404};
	//console.log(await res.text());
	const text = await res.text();

	DEBUG_INFO.DEBUG && trackIngress(text);

	if (!res.ok) {
		if (res.status == 404) {
			return "404";
		}
		if (text.includes("im_under_attack") || text.includes("cloudflare_error.ip_block") || text.includes("cloudflare_error.challenge")) {
			return "500";
		}
		return await downloadSong(id, retry - 1);
	}
	return text;
}
