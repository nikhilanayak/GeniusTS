import {Song} from "./Types";
import {parse} from "fast-html-parser";
import { downloadAnnotation } from "./GeniusAPI";


function mapKVArray(list: Record<string, string>[]): Record<string, string>{
	if(list == null) return null;

	const out = {};
	for(const key in list){
		const item = list[key];

		if(item.values != null) item.value = item.values;
		if(item.name != null) item.key = item.name;

		out[item.key] = item.value;
	}
	return out;
}

function processLyricsHTML(HTMLString: string): string{
	if(HTMLString == null) return null;
	const dom = parse(HTMLString);
	return dom.text;
}

export async function parseHTML(pageText: string): Promise<Record<string, any>>{

	if(pageText == null) return null;

	const JSON_PREFIX = "window.__PRELOADED_STATE__ =";

	let preloadedData: null | Record<string, any> = null;

	pageText.split("\n").every(line => {
		line = line.trim();
		if(line.startsWith(JSON_PREFIX)){
			line = line.slice(JSON_PREFIX.length, line.length);
			line = "return " + line;

			preloadedData = (new Function(line))();
			return false;
		}
		return true;
	});

	//console.log(JSON.stringify(preloadedData, null, 4));

	const KVData = {...mapKVArray(preloadedData?.songPage?.trackingData), ...mapKVArray(preloadedData?.songPage?.dfpKv)};



	//console.log(JSON.stringify(preloadedData));

	const page = parse(pageText);

	// output json data
	const lyrics = processLyricsHTML(preloadedData?.songPage?.lyricsData?.body?.html);

	const GENRE_TAGS_CSS = ".SongTags__Tag-xixwg3-2";
	const tags = page.querySelectorAll(GENRE_TAGS_CSS).map(i => i.text);

	const title = {"name": KVData?.Title, "id": KVData?.["Song ID"]};
	const artist = {"name": KVData?.["Primary Artist"], "id": KVData?.["Primary Artist ID"]};
	const isMusic = KVData?.["Music?"];
	const releaseDate = KVData?.["Release Date"];
	const language = KVData?.["Lyrics Language"];
	const topic = KVData?.topic;
	const url = preloadedData?.songPage?.path;
	const pageViews = KVData?.pageviews;
	const explicit = KVData?.is_explicit?.[0];

	const annotationIDs = preloadedData?.songPage?.lyricsData?.referents;
	const verifieds = preloadedData?.entities?.referents;

	const annotations = await Promise.all(annotationIDs.map(async i => {

		const [highlightedText, annotation] = await downloadAnnotation(i);
		const status = verifieds?.[i]?.classification;

		return {
			"text": highlightedText,
			"annotation": annotation,
			"status": status
		};
	}));

	const out = {
		lyrics,
		tags,
		title,
		artist,
		isMusic,
		releaseDate,
		language,
		topic,
		url,
		pageViews,
		explicit,
		annotations
	};

	return out;
}
