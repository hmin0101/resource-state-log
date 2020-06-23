import fs from 'fs';
import path from 'path';
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
    const data: string = fs.readFileSync(config.input).toString();
    // Check output directory
    const exist: boolean = fs.existsSync(config.output);
    if (!fs.existsSync(config.output)) {
        fs.mkdirSync(config.output);
        console.log("Create log directory");
    }
    // Write Datat
    const datetime: number = Date.now();
    const filePath: string = config.output + "/" + datetime + "_meminfo";
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Create meminfo (" + datetime + ")");
        }
    });
}
// Exit
process.on('SIGTERM', function () {
    console.log('Got SIGTERM signal.');
    clearImmediate(handler);
});