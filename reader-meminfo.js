"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
    const data = fs_1.default.readFileSync(config.input).toString();
    // Check output directory
    const exist = fs_1.default.existsSync(config.output);
    if (!fs_1.default.existsSync(config.output)) {
        fs_1.default.mkdirSync(config.output);
        console.log("Create log directory");
    }
    // Write Datat
    const datetime = Date.now();
    const filePath = config.output + "/" + datetime + "_meminfo";
    fs_1.default.writeFile(filePath, data, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log("Create meminfo (" + datetime + ")");
        }
    });
}
// Exit
process.on('SIGTERM', function () {
    console.log('Got SIGTERM signal.');
    clearImmediate(handler);
});
