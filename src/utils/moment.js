import moment from "moment"
import "moment-timezone/builds/moment-timezone-with-data"
// 不使用raw_offset，避免還要計算dst_offset的狀況

export const clockFilter = {
  filters: {
    wholeDayClock(datetime) {
      // 01:00 - 24:00
      return moment.parseZone(datetime).format('HH:mm')
    },
    halfDayClock(datetime) {
      // 01:00 - 12:00 AM/PM
      return moment.parseZone(datetime).format('hh:mm A')
    }
  }
}

export const dateFilter = {
  filters: {
    dateDetail(datetime) {
      //  顯示: 星期 月份 日期
      return moment.parseZone(datetime).format('ddd MMM DD')
    },
    monthAndDay(datetime) {
      // 顯示: 月份 日期
      return moment.parseZone(datetime).format('MMM D')
    },
    month(datetime) {
      // 顯示: 月份 Jan - Dec
      return moment.parseZone(datetime).format('MMM')
    },
    day(datetime) {
      // 顯示: 日期 1 - 31
      return moment.parseZone(datetime).format('D')
    },
    weeks(datetime) {
      // 顯示: 星期 Mon - Sun
      return moment.parseZone(datetime).format('ddd')
    }
  }
}

export const stringFilter = {
  filters: {
    symbol(number) {
      // 用參數控制 ± 符號
      if (number >= 0) return '+' + Math.abs(number)
      else return number
    },
  }
}