"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const analysis = require('./analysis');
// Get config
const config = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "./config.json")).toString());
// Handler
let handler = customInverval();
// SetInterval
function customInverval() {
    cycle();
    return setInterval(() => {
        cycle();
    }, config.interval);
}
// Cycle
function cycle() {
    // Check output directory (main = logs directory)
    let exist = fs_1.default.existsSync(config.logDir);
    if (!exist) {
        fs_1.default.mkdirSync(config.output);
        console.log("Create log directory");
    }
    // Check output log directory
    for (const key of Object.keys(config.resource)) {
        const resource = config.resource[key];
        const dirPath = path_1.default.join(config.logDir + "/" + resource.outputDir);
        exist = fs_1.default.existsSync(dirPath);
        if (!exist) {
            fs_1.default.mkdirSync(dirPath);
            console.log("Create log directory");
        }
    }
    // Get current time
    const datetime = getDatetime();
    // Read log and write data
    for (const key of Object.keys(config.resource)) {
        const resource = config.resource[key];
        // Read
        const data = fs_1.default.readFileSync(resource.input).toString();
        // Analysis
        let resultData;
        if (key === "cpu") {
            resultData = analysis.cpu(datetime.date, data);
        }
        else if (key === "mem") {
            resultData = analysis.memory(datetime.date, data);
        }
        // Write
        const dirPath = path_1.default.join(config.logDir + "/" + resource.outputDir);
        const filePath = dirPath + "/" + datetime.str + "_" + key + "Info.json";
        fs_1.default.writeFile(filePath, JSON.stringify(resultData), (err) => {
            if (err) {
                console.error(err);
            }
            else {
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
    const date = new Date();
    const datetimeStr = date.getFullYear().toString() +
        (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        "_" + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    const datetime = date.getFullYear().toString() +
        "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
        "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    return { str: datetimeStr, date: datetime };
}
