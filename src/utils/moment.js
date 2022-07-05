import moment from "moment"
import "moment-timezone/builds/moment-timezone-with-data"

export const clockFilter = {
  filters: {
    wholeDayClock(datetime) {
      // 24HR
      return moment.parseZone(datetime).format('HH:mm')
    },
    halfDayClock(datetime) {
      // 12HR AM/PM
      return moment.parseZone(datetime).format('hh:mm A')
    },
  }
}

export const dateFillter = {
  filters: {
    date(datetime) {
      return moment.parseZone(datetime).format('ddd MMM DD')
    }
  }
}

export const offSetFilter = {
  filters: {
    offSet(number) {
      return number > 0 ? '+' + number : number
    }
  }
}