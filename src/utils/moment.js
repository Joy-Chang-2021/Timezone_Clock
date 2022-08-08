import moment from "moment"
import "moment-timezone/builds/moment-timezone-with-data"
// 不使用raw_offset，避免還要計算dst_offset的狀況

export const clockFilter = {
  filters: {
    // ===左側面板時間顯示===
    clockMode(datetime, mode) {
      // 若 isWholeDayMode(mode): true 回傳24時制
      if (mode) return moment.parseZone(datetime).format('HH:mm')
      // 若 false 回傳12am/pm時制
      else return moment.parseZone(datetime).format('hh:mm a')
    },
    // ===右側面板時間顯示===
    hourPanelMode(hour, number) {
      // 24時制: hour % 24
      // 12am/pm時制: hour % 12
      return hour % number
    },
    hourStatus(hour) {
      // 12點以後pm
      return (hour % 24) > 11 ? "pm" : "am"
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