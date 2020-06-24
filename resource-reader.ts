import fs from 'fs';
import path from 'path';
const analysis = require('./analysis');
// Get config
const config: any = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json")).toString());
// Handler
let handler: any = customInverval();
// SetInterval
function customInverval() {
    cycle();
    return setInterval(() => {
        cycle();
    }, config.interval)
}
// Cycle
function cycle() {
    // Check output directory (main = logs directory)
    let exist: boolean = fs.existsSync(config.logDir);
    if (!exist) {
        fs.mkdirSync(config.output);
        console.log("Create log directory");
    }
    // Check output log directory
    for (const key of Object.keys(config.resource)) {
        const resource = config.resource[key];
        const dirPath: string = path.join(config.logDir + "/" + resource.outputDir);
        exist = fs.existsSync(dirPath);
        if (!exist) {
            fs.mkdirSync(dirPath);
            console.log("Create log directory");
        }
    }
    // Get current time
    const datetime: any = getDatetime();
    // Read log and write data
    for (const key of Object.keys(config.resource)) {
        const resource = config.resource[key];
        // Read
        const data: string = fs.readFileSync(resource.input).toString();
        // Analysis
        let resultData: any;
        if (key === "cpu") {
            resultData = analysis.cpu(datetime.date, data);
        } else if (key === "mem") {
            resultData = analysis.memory(datetime.date, data);
        }

        // Write
        const dirPath: string = path.join(config.logDir + "/" + resource.outputDir);
        const filePath: string = dirPath + "/" + datetime.str + "_" + key + "Info.json";
        fs.writeFile(filePath, JSON.stringify(resultData), (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Create " + key + " info (" + datetime.date + ")");
            }
        });
    }
}
// Exit
process.on('SIGTERM', function () {
    console.log('Got SIGTERM signal.');
    clearImmediate(handler);
});

function getDatetime() {
    const date: Date = new Date();
    const datetimeStr: string = date.getFullYear().toString() + 
            (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
            (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
            "_" + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
            (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
            (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    const datetime: string = date.getFullYear().toString() + 
            "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
            "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
            " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
            ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
            ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    return { str: datetimeStr, date: datetime };
}