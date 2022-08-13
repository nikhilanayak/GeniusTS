import axios from "axios";
import {parse} from "fast-html-parser";

const PROTO = "http";

export async function downloadAnnotation(id: number, retry=5): Promise<[any, any, any]>{
	if(retry == 0) return null;
	try{
		const res = await axios.get(`${PROTO}://genius.com/${id}`);
		const data = res.data;

		const page = parse(data);

		const metas = page.querySelectorAll("meta");

		const referent = metas.filter(i => i.attributes.property == "rap_genius:referent")?.[0]?.attributes?.content;
		const description = metas.filter(i => i.attributes.property == "og:description")?.[0]?.attributes?.content;

		//let unreviewed = data.includes('\"classification\":\"unreviewed\"');
		const unreviewed = false;

		return [referent, description, unreviewed];

	}
	catch(err){
		console.error(err);
		if(err.response.status == 404){
			return null;
		}
		return await downloadAnnotation(id, retry - 1);
	}
}

export async function downloadSong(id: number, retry=5): Promise<string> | null{
	if(retry == 0) return null;
	try{
		const res = await axios.get(`${PROTO}://genius.com/songs/${id}`);

		return res.data;
	}
	catch(err){
		//console.error(err);
		if(err.response.status == 404){
			return null;
		}
		return await downloadSong(id, retry - 1);
	}

}