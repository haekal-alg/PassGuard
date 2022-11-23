// note: absolutely inefficient but it works for now so meh
function log(msg) {
    var dateObj = new Date();

    var day = dateObj.getUTCDate();
    var month = dateObj.getUTCMonth() + 1; // months from 1-12
    var year = dateObj.getUTCFullYear();

    var hour = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var seconds = dateObj.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

    var newTime = "";
    var arr = [hour, minutes, seconds];
    for (let i = 0; i < arr.length; i++) {
        var formattedNumber = arr[i].toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
        newTime += formattedNumber;
        if (i < arr.length-1) newTime += ":";
    }

    newDate = day + "/" + month + "/" + year;

    console.log(`[${newDate} ${newTime} ${msg}`);
}

module.exports.log = log;