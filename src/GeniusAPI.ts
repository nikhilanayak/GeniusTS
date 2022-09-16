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


const COOKIE = 'cf_clearance=mxTyzoSGH.uW7miobQXNWqhiwXuFmYsTTIKLmEU_ntk-1663300260-0-250; _genius_ab_test_cohort=13; _genius_ab_test_song_recommendations_v2=mixpanel; genius_first_impression=1663110410351; GLAM-AID=e359061aea0640c7818db5f523fc8eb7; GLAM-SID=a03bf9c3c9224669bd5d7e3b686e26b6; _algolia_anonymous_user_token=2bbc2b6d-cdaf-4bf8-9fa4-b5115a26e172; _csrf_token=Dnq2SRBEAI10i4dfxZN4jQBeHI3EXYw8jFeA%2FSZjvSM%3D; _rapgenius_session=BAh7BzoPc2Vzc2lvbl9pZEkiJWExNjRmMDlkM2IwN2RmNmNkZjc0N2U4ODgxYjE2MmFiBjoGRUY6EF9jc3JmX3Rva2VuSSIxRG5xMlNSQkVBSTEwaTRkZnhaTjRqUUJlSEkzRVhZdzhqRmVBL1NaanZTTT0GOwZG--373ef1859d20d7009eea6e789831a299ccdde844; csuuidSekindo=63210d1214371; _ab_tests_identifier=e8f6e9d1-ad62-4da3-8b48-a50f52d281bd; _pbjs_userid_consent_data=3524755945110770; _lr_env_src_ats=false; GLAM-JID=b682285338714b289f89811d6edb219c; __j_state=%7B%22landing_url%22%3A%22https%3A%2F%2Fgenius.com%2FYeat-dub-lyrics%22%2C%22pageViews%22%3A4%2C%22prevPvid%22%3A%229b1f3caf86c04599b690ce6c71ff7728%22%2C%22extreferer%22%3A%22https%3A%2F%2Fgenius.com%2FYeat-dub-lyrics%3F__cf_chl_tk%3DsWaI1OgqOVMIqJJO1UhHPQ4CPHyxoip34VrNMB.OQg4-1663300238-0-gaNycGzNCn0%22%2C%22user_worth%22%3A0%7D; mp_mixpanel__c=0; _lr_retry_request=true; flash=%7B%7D; mp_77967c52dc38186cc1aadebdd19e2a82_mixpanel=%7B%22%24initial_referrer%22%3A%20%22http%3A%2F%2Fgenius.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22genius.com%22%2C%22AMP%22%3A%20false%2C%22genius_platform%22%3A%20%22web%22%2C%22Logged%20In%22%3A%20false%2C%22Mobile%20Site%22%3A%20false%2C%22Tag%22%3A%20%22rap%22%2C%22%24search_engine%22%3A%20%22google%22%7D';

async function myFetch(url: string) {
	const TIMEOUT_SEC = 30;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort, TIMEOUT_SEC * 1000);
	try{
		return fetch('https://genius.com/songs/1', {
			headers: {
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.5',
				//'Accept-Encoding': 'gzip, deflate, br',
				'DNT': '1',
				'Connection': 'keep-alive',
				'Cookie': COOKIE,
				'Upgrade-Insecure-Requests': '1',
				'Sec-Fetch-Dest': 'document',
				'Sec-Fetch-Mode': 'navigate',
				'Sec-Fetch-Site': 'none',
				'Sec-Fetch-User': '?1',
				'TE': 'trailers'
			}
		});


		//return await fetch(url, { signal: controller.signal });
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
