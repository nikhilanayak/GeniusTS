//import axios from "axios";
import {parse} from "fast-html-parser";
import https from "https";
import fetch from "node-fetch";

const PROTO = "https";

//const axiosArgs = {};

async function redirFetch(url: string){
	//return await axios.get(url);
	//return await fetch(url, {agent: null});
	return await fetch(url);
}

export async function downloadAnnotation(id: number, retry=5): Promise<[any, any, any]>{
	if(retry == 0) return null;

	const res = await redirFetch(`${PROTO}://genius.com/${id}`);

	if(!res.ok){
		if(res.status == 404){
			return null;
		}
		return await downloadAnnotation(id, retry - 1);
	}

	//@ts-ignore
	//const data = res.data;//await res.text();
	const data = await res.text();

	const page = parse(data);

	const metas = page.querySelectorAll("meta");

	const referent = metas.filter(i => i.attributes.property == "rap_genius:referent")?.[0]?.attributes?.content;
	const description = metas.filter(i => i.attributes.property == "og:description")?.[0]?.attributes?.content;

	const unreviewed = false;

	return [referent, description, unreviewed];



}

export async function downloadSong(id: number, retry=5): Promise<string> | null{
	if(retry == 0) return null;

	const res = await redirFetch(`${PROTO}://genius.com/songs/${id}`);// || {ok: false, status: 404};
	//console.log(await res.text());
	const text = await res.text();
	if(!res.ok){
		if(res.status == 404){
			return "404";
		}
		if(text.includes("im_under_attack")){
			return "500";
		}
		return await downloadSong(id, retry - 1);
	}
	//@ts-ignore
	//return await res.text();
	return text;
}
