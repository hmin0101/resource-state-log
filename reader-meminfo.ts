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
    const datetime: number = Date.now();
    // Read log and write data
    for (const key of Object.keys(config.resource)) {
        const resource = config.resource[key];
        // Read
        const data: string = fs.readFileSync(resource.input).toString();
        // Write
        const dirPath: string = path.join(config.logDir + "/" + resource.outputDir);
        const filePath: string = dirPath + "/" + datetime + "_" + key + "Info";
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Create meminfo (" + datetime + ")");
            }
        });
    }
}
// Exit
process.on('SIGTERM', function () {
    console.log('Got SIGTERM signal.');
    clearImmediate(handler);
});