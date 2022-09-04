import { exec } from "child_process";
import express from "express";
import { readdirSync, readFileSync, rmSync } from "fs";
import { clearInterval } from "timers";
const app = express();
const JOBS = 1024;
function popFile(id) {
    const fName = `/dev/shm/data/${id}.json`;
    const text = readFileSync(fName);
    try {
        rmSync(fName);
    }
    catch (err) { }
    return text.toString();
}
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
        }
        res.end();
    });
    req.on("close", () => {
        console.log("\nrequest cancelled");
        clearInterval(interval);
        proc.kill("SIGKILL");
        for (let i = start; i <= end; i++) {
            try {
                const fName = `/dev/shm/data/${i}.json`;
                rmSync(fName);
            }
            catch (err) { }
        }
    });
});
app.listen(3030, () => {
    console.log("started server");
});
