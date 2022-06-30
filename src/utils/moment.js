import moment from "moment"
import "moment-timezone/builds/moment-timezone-with-data"

export const userZone = moment.tz.guess();
// export const zoneAll = moment.tz.names();
// const countries = moment.tz.zonesForCountry('US');

console.log(userZone)
// console.log(zonelist); // [594], year 1900-2038
// console.log(countries)