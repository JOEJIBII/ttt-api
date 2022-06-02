const { CronJob } = require("cron");

var working = false;

module.exports = () => {
    new CronJob("* * * * * *", () => {
        working === false && mainProcess();
    }, null, true);
}

var i = 0;

const mainProcess = () => {
    try {
        working = true;
        setTimeout(() => console.log("process finished at ", new Date().toISOString()), 100);
        i++;
        if (i < 10) {
            mainProcess();
        } else {
            console.log("finished all process");
            setTimeout(() => {
                i = 0;
                working = false;
            }, 3000);
        }
    } catch (error) {
        setTimeout(() => {
            console.error("main process error, wait 10 second to work again");
            console.error("error description : ", error["message"]);
        }, 10000);
    }
}