import express from "express";
import {parseHTML} from "./GeniusParser";
import {downloadSong} from "./GeniusAPI";

const app = express();

app.get("/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	
	const html = await downloadSong(id);
	console.log(html);

	if(html == "500"){
		res.json({cloudflare: true});
	}

	const data = await parseHTML(html);

	//res.send("Hello");
	res.json(data);
});

app.listen(3030);
