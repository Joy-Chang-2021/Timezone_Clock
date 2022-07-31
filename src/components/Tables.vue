<template>
  <div class="d-flex">
    <div class="left">
      <draggable
        class="list-group"
        tag="ul"
        v-model="zonesData"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition">
          <li
            v-for="zone in zonesData"
            :key="zone.index"
            class="border-bottom d-flex list-height position-relative"
          >
            <div class="setting d-flex position-absolute list-height">
              <i class="fa-solid fa-circle-xmark fa-2xs my-2"></i>
              <i
                class="fa-solid fa-house fa-2xs my-2"
                :class="{ 'd-none': zone.timezone === mainZone }"
              ></i>
            </div>
            <div class="row mx-0 align-items-center w-100 list-height">
              <div class="col-2">
                <!-- 各區標準時差 -->
                {{ localOffSet(zone.datetime) | symbol }}
              </div>
              <div class="col-6 text-left">
                <h3 class="my-0 text-15">
                  <strong>
                    <!-- 地區名 -->
                    {{ zone.timezone.split("/")[1] }}
                  </strong>
                  <span class="text-black-50 text-12 ml-1">
                    <!-- 時差縮寫 -->
                    {{ zone.abbreviation }}
                  </span>
                </h3>
                <p class="my-0 text-black-50 text-12">
                  <!-- 國家/ TODO: 城市名 -->
                  {{ zone.timezone.split("/")[0] }}
                </p>
              </div>
              <div class="col-4 text-right">
                <h3 v-if ="zone.clickClock" class="my-0 text-black-50 text-15">
                  <!-- 當地時間/ TODO: 所選時間 -->
                  {{ zone.clickClock }}
                </h3>
                <h3 v-else class="my-0 text-black-50 text-15">
                  <!-- 當地時間/ TODO: 所選時間 -->
                  {{ zone.datetime | wholeDayClock }}
                </h3>
                <p class="my-0 text-black-50 text-12">
                  <!-- 當地日期/ TODO: 所選日期 -->
                  {{ zone.datetime | dateDetail }}
                </p>
              </div>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class="right flex-column scroll position-relative">
      <div class="position-absolute w-100 h-100 background-wrapper">
        <ul class="d-flex m-0 h-100" v-if="setCalendar.length === 0">
          <li
            v-for="order in 24"
            :key="order"
            :class="['w-100', {'bg-success': hourCheck(mainZoneData.datetime, order - 1)}]"
          >
          &nbsp;
          </li>
        </ul>
      </div>
      <div>
        <ul
          v-for="zone in zonesData"
          :key="zone.index"
          class="
            d-flex
            align-items-center
            position-relative
            my-0
            w-100
            text-12
            list-height
            border-bottom
          "
        >
          <li
            v-for="order in 24"
            :key="order"
            class="
              w-100
              h-50
              d-flex
              flex-column
              justify-content-center
              align-items-center
            "
          >
            <!-- 非整數時差 -->
            <div v-if="timeLagCompared(zone.datetime) % 1">
              <!-- 0點/顯示日期 -->
              <template v-if="firstDayCheck(zone.datetime, order - 1)">
                <p class="my-0 line-normal position-absolute weekdays-panel">
                  {{ changeDay(zone.datetime) | weeks }}
                </p>
                <p class="my-0 line-normal">
                  {{ changeDay(zone.datetime) | month }}
                </p>
                <p class="my-0 line-normal">
                  {{ changeDay(zone.datetime) | day }}
                </p>
              </template>
              <!-- 1-23點 -->
              <template v-else>
                <p class="my-0 line-normal">
                  {{ (parseInt(timeLagCompared(zone.datetime)) + order - 2) | wholeDayFormat }}
                </p>
                <p class="my-0 line-normal">
                  {{ zone.datetime | getMinutes }}
                </p>
              </template>
            </div>
            <!-- 整數時差 -->
            <div v-else>
              <!-- 0點 -->
              <template v-if="firstDayCheck(zone.datetime, order)">
                <p class="my-0 line-normal position-absolute weekdays-panel">
                  {{ changeDay(zone.datetime) | weeks }}
                </p>
                <p class="my-0 line-normal">
                  {{ changeDay(zone.datetime) | month }}
                </p>
                <p class="my-0 line-normal">
                  {{ changeDay(zone.datetime) | day }}
                </p>
              </template>
              <!-- 1-23點 -->
              <template v-else>
                <p class="my-0 line-normal">
                  {{ (parseInt(timeLagCompared(zone.datetime)) + order - 1) | wholeDayFormat }}
                </p>
              </template>
            </div>
          </li>
        </ul>
      </div>
      <div class="position-absolute w-100 h-100 hover-wrapper">
        <ul class="d-flex m-0 h-100">
          <li
            v-for="hour in hourClickedPanel"
            :key="hour.hourIndex"
            @click.stop="hourClicked(hour)"
            :class="[
              'w-100',
              'hour-hover',
              {'hour-outside-clicked': hour.panelClicked},
              {'border border-dark': !hour.panelClicked && hourClickedPanel.some(hour => hour.panelClicked)}
            ]"
          >
          &nbsp;
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import moment from "moment";
import "moment-timezone/builds/moment-timezone-with-data";
import {
  clockFilter,
  dateFilter,
  mathFilter,
  symbolFilter,
} from "../utils/moment";

export default {
  name: "Tables",
  components: {
    draggable,
  },
  mixins: [clockFilter, dateFilter, mathFilter, symbolFilter],
  props: {
    setMainZone: {
      type: String,
      require: true,
    },
    setZonesName: {
      type: Array,
      require: true,
    },
    setMainZoneData: {
      type: Object,
      require: true,
    },
    setZonesData: {
      type: Array,
      require: true,
    },
    setCalendar: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      zonesName: [],
      zonesData: [],
      mainZone: "",
      mainZoneData: {},
      hourClickedPanel: [],
      drag: false,
    };
  },
  methods: {
    fetchPropsData() {
      // 與API無關之靜態資料
      this.mainZone = this.setMainZone;
      this.zonesName = this.setZonesName;
    },
    timeLagCompared(datetime) {
        // 計算兩地時差: 其他地區的UTC offset - 基準地區UTC offset
        return this.localOffSet(datetime) -
          this.localOffSet(this.mainZoneData.datetime)
    },
    calendarChanged() {
      // 監測點擊的日期，修改主要時區資料
      if (this.setCalendar.length === 0) return;
      const newDate = moment.tz(this.setCalendar, this.mainZone).format();
      this.zonesData = this.zonesData.map((zone) => {
        if (zone.timezone === this.mainZone)
          return {
            ...zone,
            datetime: newDate,
          };
        else
          return {
            ...zone,
            datetime: moment(newDate).tz(zone.timezone).format(),
          };
      });
    },
    hourClickDefault() {
      // 建立hour點擊區資料：編號(1-24)、遮色樣式(panelClicked)、
      for (let index = 0; index <= 23; index++ ) {
        this.hourClickedPanel.push({
          hourIndex: index,
          panelClicked: false,
        })
      }
    },
    hourClicked(targetHour) {
      // 啟動hour點擊區：
      // 計算指定顯示的日期與時間、格式
      this.hourClickedData(targetHour)
      // 修改樣式: 取消所有點擊資料，非指定時間予遮色樣式(panelClicked: true)
      this.hourClickedPanel.forEach(hour => {
        hour.panelClicked = false
        if (hour.hourIndex !== targetHour.hourIndex) hour.panelClicked = true
      })
    },
    hourClickedData(targetHour) {
      // 計算指定顯示的日期與時間、格式
      this.zonesData.map(zone => {
        // 與主要時區的兩地時差
        const timeLag = this.timeLagCompared(zone.datetime)
        // 當地時間的「小時」數字
        const zoneHour = targetHour.hourIndex + timeLag
        // 當地時間的「分鐘」數字
        const zoneMinute = (1 - Math.abs(timeLag % 1)) * 60
        // 區別主要地區時間/當地時間、區別整數時差、非整數時差地區
        if (zone.timezone === this.mainZoneData.timezone) {
          zone.clickClock = `${targetHour.hourIndex}:00 - ${targetHour.hourIndex + 1}:00`
        } else if (timeLag % 1) {
          console.log('有分鐘數: ')
          console.log('zoneHour: ', zoneHour, ' ; zoneMinute: ', zoneMinute)
          if (zoneHour > 0) {
            // 今日
            zone.clickClock = `${parseInt(zoneHour)}:${zoneMinute} - ${parseInt(zoneHour) + 1}:${zoneMinute}`
          } else if (Math.floor(zoneHour) + 25 === 24) {
            // 前一日 ~ 今日
            zone.clickClock = `${Math.floor(zoneHour) + 24}:${zoneMinute} - 00:${zoneMinute}`
          } else {
            // 前一日
            zone.clickClock = `${Math.floor(zoneHour) + 24}:${zoneMinute} - ${Math.floor(zoneHour) + 25}:${zoneMinute}`
          }
        } else {
          if (zoneHour < 0) {
            zone.clickClock = `${zoneHour + 24}:00 - ${zoneHour + 25}:00`
          } else if (zoneHour >= 24) {
            zone.clickClock = `${zoneHour - 24}:00 - ${zoneHour - 23}:00`
          } else {
            zone.clickClock = `${zoneHour}:00 - ${zoneHour + 1}:00`
          }
        }
      })
    },
    hourUnClick() {
      // 關閉hour點擊區：取消遮色樣式(panelClicked: false)
      this.hourClickedPanel.forEach(hour => hour.panelClicked = false)
      this.zonesData = this.zonesData.map(zone => {
        return zone = {
          ...zone,
          clickClock: '',
          clickDatetime: ''
        }
      })
    }
  },
  computed: {
    localOffSet() {
      return (datetime) => {
        // 計算當地時間的UTC偏移量(已含日光節約時間), 單位hr
        return moment.parseZone(datetime).utcOffset() / 60;
      };
    },
    hourCheck() {
      return (datetime, number) => {
        // 取 datetime 小時數字，與指定數字相同即回傳 true
        const hour = moment.parseZone(datetime).hour()
        if (hour === number) return true
        else return false
      }
    },
    firstDayCheck() {
      return (datetime, order) => {
        // 辨識0時/24時以顯示月份日期：兩地時差 + 格子序(1-24) - 標準地格子序(1)
        if (parseInt(this.timeLagCompared(datetime)) + order - 1 === 0)
          return true;
        else if (parseInt(this.timeLagCompared(datetime)) + order - 1 === 24)
          return true;
        else return false;
      };
    },
    changeDay() {
      return (datetime) => {
        // 0點顯示日期，須換日 & 不須換日
        const timeLag = this.timeLagCompared(datetime);
        if (timeLag > 0) return moment.parseZone(datetime).add(1, "days");
        else return datetime;
      };
    },
    dragOptions() {
      // for draggable css effect
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  created() {
    this.fetchPropsData();
    this.hourClickDefault()
  },
  mounted() {
    document.addEventListener('click', this.hourUnClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hourUnClick);
  },
  watch: {
    setMainZoneData() {
      // 由API取得之非同步資料
      this.mainZoneData = this.setMainZoneData;
    },
    setZonesData() {
      // 由API取得之非同步資料
      this.zonesData = this.setZonesData.map(zone => {
        return zone = {
          ...zone,
          clickClock: '',
          clickDatetime: ''
        }
      })
    },
    setCalendar() {
      this.calendarChanged();
    },
  },
};
</script>

<style lang="scss" scoped>
.list-height {
  height: 4rem;
}
.text-15 {
  font-size: 15px;
}
.text-12 {
  font-size: 12px;
}
.line-normal {
  line-height: normal;
}
.setting {
  transform: translateX(-100%);
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
}
.weekdays-panel {
  transform: translate(-20%, -110%);
}
.scroll {
  overflow-x: auto;
  white-space: nowrap;
}
.background-wrapper {
  z-index: -50;
  opacity: 0.1
}
.hover-wrapper {
  z-index: +50;
  .hour-hover:hover {
    border: 1px solid black
  }
  .hour-outside-clicked {
    background-color: rgba(255, 255, 255, 0.8)
  }
}
// draggable css
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>