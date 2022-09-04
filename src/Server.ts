import { exec, execSync } from "child_process";
import express from "express";
import { readdirSync, readFileSync, rmSync } from "fs";

const app = express();

const JOBS = 1024;


function popFile(id: number) {
    const fName = `/dev/shm/data/${id}.json`;
    try{
        const text = readFileSync(fName);
        return text.toString();
    }
    catch(err){
        return "";
    }
    try {
        rmSync(fName);
    }
    catch (err) { }
}

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/:start/:end", (req, res) => {
    const start = parseInt(req.params.start);
    const end = parseInt(req.params.end);
    if (isNaN(start) || isNaN(end)) {
        return res.json({ err: "CMD_ERR" });
    }



    console.log(`Received Request For IDs ${start}-${end}`);

    //execSync(`bash run.sh ${start} ${end} ${JOBS}`).toString();

    const interval = setInterval(() => {
        process.stdout.write(readdirSync("/dev/shm/data").length + "\r");
    }, 1000);

    const proc = exec(`bash run.sh ${start} ${end} ${JOBS}`, (err, stdout, stderr) => {
        clearInterval(interval);
        for (let i = start; i <= end; i++) {
            const text = popFile(i);
            res.write(text);
            res.write("\n");
        }
        res.end();

    });



});

app.listen(3030, () => {
    console.log("started server");
});