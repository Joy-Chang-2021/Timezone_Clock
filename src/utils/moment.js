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
    },
    getMinutes(datetime) {
      // 取得非整數時差的「分鐘數」
      return moment.parseZone(datetime).utcOffset() % 60
    }
  }
}

export const dateFillter = {
  filters: {
    dateDetail(datetime) {
      //  顯示: 星期 月份 日期
      return moment.parseZone(datetime).format('ddd MMM DD')
    },
    month(datetime) {
      // 顯示: 月份 Jan - Dec
      return moment.parseZone(datetime).format('MMM')
    },
    day(datetime) {
      // 顯示: 日期 1st - 31st
      return moment.parseZone(datetime).format('Do')
    },
    weeks(datetime) {
      // 顯示: 星期 Mon - Sun
      return moment.parseZone(datetime).format('ddd')
    },
    dayChange(datetime, number) {
      // 修改日期: 加減天數
      return moment.parseZone(datetime).add(number, 'days')
    }
  }
}

export const mathFilter = {
  filters: {
    wholeDayPanel(number) {
      // 24時制: 負數需 + 24 校正
      return number < 0 ? number + 24 : number
    },
    mathFloor(number) {
      // 小數點: 無條件捨去
      return Math.floor(number)
    }
  }
}

export const symbolFilter = {
  filters: {
    symbol(number, symbol) {
      // 用參數控制 ± 符號
      return symbol + Math.abs(number)
    }
  }
}