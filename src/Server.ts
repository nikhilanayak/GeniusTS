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
	offset += BATCH_SIZE;
	lock = false;
});

app.listen(8008, () => {
	console.log("started server");
});