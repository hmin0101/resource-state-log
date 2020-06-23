"use strict";
module.exports = {
    cpu: (data) => {
        const rows = data.split('\n');
        // Set cpuInfo
        const cpuInfo = {
            core: {},
            processes: 0,
            procs_running: 0,
            procs_blocked: 0
        };
        // Cores
        for (let i = 0; i < rows.length; i++) {
            let key = (i - 1).toString();
            const data = rows[i].split(' ');
            if (key === "-1") {
                data.splice(1, 1);
                key = "total";
            }
            if (data[0].includes('cpu')) {
                cpuInfo.core[key] = {
                    user: Number(data[1]),
                    nice: Number(data[2]),
                    system: Number(data[3]),
                    idle: Number(data[4]),
                    total: Number(data[1]) + Number(data[2]) + Number(data[3]) + Number(data[4]),
                    usageUser: 0,
                    usageSystem: 0
                };
                // Calculation
                cpuInfo.core[key].usageUser = Number(((cpuInfo.core[key].user / cpuInfo.core[key].total) * 100).toFixed(2));
                cpuInfo.core[key].usageSystem = Number(((cpuInfo.core[key].system / cpuInfo.core[key].total) * 100).toFixed(2));
            }
            else if (data[0] === "processes") {
                cpuInfo.process = Number(data[1]);
            }
            else if (data[0] === "procs_running") {
                cpuInfo.procs_running = Number(data[1]);
            }
            else if (data[0] === "procs_blocked") {
                cpuInfo.procs_blocked = Number(data[1]);
            }
        }
        // Return
        return cpuInfo;
    },
    memory: (data) => {
        // remove blank and kB
        let convertedData = data.replace(/ /g, '');
        convertedData = convertedData.replace(/kB/g, '');
        // Split
        const rows = convertedData.split('\n');
        // Create memInfo
        const memInfo = {
            unit: "KB",
            total: Number((rows[0].split(':'))[1]),
            free: Number((rows[1].split(':'))[1]),
            available: Number((rows[2].split(':'))[1]),
            buffer: Number((rows[3].split(':'))[1]),
            cached: Number((rows[4].split(':'))[1]),
            active: Number((rows[6].split(':'))[1]),
            usage: 0
        };
        // Calculate usage
        memInfo.usage = Number((((memInfo.total - memInfo.available) / memInfo.total) * 100).toFixed(2));
        // Return
        return memInfo;
    }
};
