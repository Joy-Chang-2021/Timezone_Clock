import moment from "moment"
import "moment-timezone/builds/moment-timezone-with-data"

var a = moment.tz("2013-11-18 11:55", "Asia/Taipei");
var b = moment.tz("2013-11-18 11:55", "America/Toronto");

console.log(a.format()); // 2013-11-18T11:55:00+08:00
console.log(b.format()); // 2013-11-18T11:55:00-05:00