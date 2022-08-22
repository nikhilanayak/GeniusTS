//import * as express from "express";
import express from "express";
import { BATCH_SIZE } from "./Params";

const app = express();

let offset = 0;
let lock = false;


app.get("/chunk", (req, res) => {
	while(lock){continue;}
	lock = true;
	res.send("" + offset);
	console.log(offset);
	offset += BATCH_SIZE;
	lock = false;
});

app.get("/reset", (req, res) => {
	while(lock){continue;}
	lock = true;
	res.send("");
	offset = 0;
	lock = false;
});

app.listen(4422, () => {
	console.log("started server");
});
