<template>
  <div class="d-flex" v-if="!this.isLoading">
    <div class="left">
      <draggable
        class="list-group"
        tag="ul"
        v-model="zonesPanelData"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition">
          <li
            v-for="zone in zonesPanelData"
            :key="zone.id"
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
                {{ getOffset(zone.datetime) / 60 | symbol }}
              </div>
              <div class="col-4 text-left">
                <h3 class="my-0 text-15">
                  <strong>
                    <!-- 地區名 -->
                    {{ zone.city }}
                  </strong>
                  <span class="text-black-50 text-12 ml-1">
                    <!-- 時差縮寫 -->
                    {{ zone.abbreviation }}
                  </span>
                </h3>
                <p class="my-0 text-black-50 text-12">
                  <!-- 國家/ TODO: 城市名 -->
                  {{ zone.country }}
                </p>
              </div>
              <div class="col-6 text-right">
                <h3 v-if ="zone.clickClock" class="my-0 text-black-50 text-15">
                  <!-- 當點擊目標時間時: 顯示所選時間 -->
                  {{ zone.clickClock }}
                </h3>
                <h3 v-else class="my-0 text-black-50 text-15">
                  <!-- default: 當地時間 -->
                  {{ zone.datetime | wholeDayClock }}
                </h3>
                <p v-if ="zone.clickDatetime" class="my-0 text-black-50 text-12">
                  <!-- 當點擊目標時間時: 顯示所選日期 -->
                  {{ zone.clickDatetime }}
                </p>
                <p v-else class="my-0 text-black-50 text-12">
                  <!-- default: 當地日期 -->
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
            v-for="index in 24"
            :key="index"
            :class="[
              'w-100',
              {'bg-success': getHour(mainZoneData.datetime) === index - 1}
            ]"
          >
          &nbsp;
          </li>
        </ul>
      </div>
      <div>
        <ul
          v-for="zone in zonesPanelData"
          :key="zone.timezone"
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
            v-for="index in 24"
            :key="index"
            class="
              w-100
              h-50
              d-flex
              flex-column
              justify-content-center
              align-items-center
            "
          >
            <div>
              <!-- 00點: 顯示日期 -->
              <template v-if="getHour(zone.beginPoint) + index - 1 === 0">
                <p class="my-0 line-normal position-absolute weekdays-panel">
                  {{ zone.beginPoint | weeks }}
                </p>
                <p class="my-0 line-normal">
                  {{ zone.beginPoint | month }}
                </p>
                <p class="my-0 line-normal">
                  {{ zone.beginPoint | day }}
                </p>
              </template>
              <template v-else-if="getHour(zone.beginPoint) + index - 1 === 24">
                <p class="my-0 line-normal position-absolute weekdays-panel">
                  {{ zone.nextDate | weeks }}
                </p>
                <p class="my-0 line-normal">
                  {{ zone.nextDate | month }}
                </p>
                <p class="my-0 line-normal">
                  {{ zone.nextDate | day }}
                </p>
              </template>
              <!-- 非00點: 顯示小時 -->
              <template v-else>
                <p class="my-0 line-normal">
                  {{ getHour(zone.beginPoint) + index - 1 >= 24 ? 
                    getHour(zone.beginPoint) + index - 25 : 
                    getHour(zone.beginPoint) + index - 1 }}
                </p>
                <p v-show ="getOffset(zone.beginPoint) % 60" class="my-0 line-normal">
                  {{ getOffset(zone.beginPoint) % 60 }}
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
import worldTimeAPI from "../utils/worldTimeAPI";
import { v4 as uuidv4 } from 'uuid';
import draggable from "vuedraggable";
import moment from "moment";
import "moment-timezone/builds/moment-timezone-with-data";
import {
  clockFilter,
  dateFilter,
  stringFilter,
} from "../utils/moment";

export default {
  name: "Tables",
  components: {
    draggable,
  },
  mixins: [clockFilter, dateFilter, stringFilter],
  props: {
    setMainZone: {
      type: String,
      require: true,
    },
    setZonesName: {
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
      isLoading: false,
      mainZone: "",
      mainZoneData: {},
      zonesName: [],
      zonesPanelData: [],
      hourClickedPanel: [],
      drag: false,
    };
  },
  methods: {
    fetchPropsData() {
      // 父層與API無關之靜態資料
      this.mainZone = this.setMainZone;
      this.zonesName = this.setZonesName;
      for (let i = 0; i < this.zonesName.length; i++) {
        // 所有時區之靜態資料，分別用於v-for渲染、點擊0-24時間點的面板渲染
        this.zonesPanelData[i] = {
          id: uuidv4(),
          clickClock: '',
          clickDatetime: ''
        }
      }
    },
    async getZonesData() {
      try {
        this.isLoading = true
        // 根據zonesName儲存之所有時區名稱，迴圈向API取得所需資料並按順序存入zonesPanelData、mainZoneData
        for (let i = 0; i < this.zonesName.length; i++) {
          const zoneName = this.zonesName[i]
          const { data, status } = await worldTimeAPI.localTimeAPI(zoneName)
          if (status != 200) throw new Error()
          const { abbreviation, datetime, timezone, dst } = data
          this.zonesPanelData[i] = {
            ...this.zonesPanelData[i],
            abbreviation, datetime, timezone, dst,
            city: timezone.split('/')[1],
            country: timezone.split('/')[0]
          }
          if (zoneName === this.mainZone) {
            this.mainZoneData = {
              abbreviation, datetime, timezone, dst,
            }
            this.setHoursData(this.mainZoneData.datetime)
            this.emitMainZoneData(this.mainZoneData)
          }
        }
        this.isLoading = false
      } catch (error) {
        console.log("error", error);
      }
    },
    emitMainZoneData(data) {
      this.$emit('mainZoneData', data)
    },
    setHoursData(datetime) {
      // 計算主時區00:00對應之各時區當地時間，用以渲染0-24小時面板時間
      // 取得指定時間(函式參數)
      const mainZoneDate = moment.parseZone(datetime).format('YYYY-MM-DD')
      // 迴圈所有時區資料 (、nextDate:)
      for (let i = 0; i < this.zonesName.length; i++) {
        // 取得當地時區名稱
        const localZone = this.zonesName[i]
        // 將指定時間轉換為當地時區時間
        const beginPoint = moment(mainZoneDate).tz(localZone).format()
        this.zonesPanelData[i] = {
          // 原資料保留
          ...this.zonesPanelData[i],
          // beginPoint: 每個時區的「第一格」時間點
          beginPoint: beginPoint,
          // nextDate: 每個時區須換日時的資料，主要須月份/日期/星期資料
          nextDate: moment.parseZone(beginPoint).add(1, 'd').format()
        } 
      }
    },
    calendarChanged() {
      // 監測點擊的日期，修改主要時區資料
      if (this.setCalendar.length === 0) return;
      const newDate = moment.tz(this.setCalendar, this.mainZone).format();
      this.zonesPanelData = this.zonesPanelData.map((zone) => {
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
    // ==== 點擊24HR面板: 樣式+資料渲染 ====
    hourClickDefault() {
      // 建立hour點擊區資料：編號(0-23)、遮色狀態(panelClicked)、
      for (let index = 0; index <= 23; index++ ) {
        this.hourClickedPanel.push({
          hourIndex: index,
          panelClicked: false,
        })
      }
    },
    hourClicked(targetHour) {
      // 啟動hour點擊區：
      // 呼叫函式: 計算指定顯示的日期與時間、格式
      this.hourClickedData(targetHour)
      // 修改樣式: 取消所有點擊資料，非指定時間予遮色樣式(panelClicked: true)
      this.hourClickedPanel.forEach(hour => {
        hour.panelClicked = false
        if (hour.hourIndex !== targetHour.hourIndex) hour.panelClicked = true
      })
    },
    hourClickedData(targetHour) {
      // 取出點擊時間之index
      const index = targetHour.hourIndex
      // 迴圈計算各時區之點擊時間
      this.zonesPanelData.map(zone => {
        // 計算小時數字
        const beginHour = moment.parseZone(zone.beginPoint).hour()
        let localHour = beginHour + index
        if (localHour >= 24) localHour = localHour - 24
        else if (localHour < 0) localHour = localHour + 24
        // 計算分鐘數字
        const minutes = Math.abs(this.getOffset(zone.datetime) % 60) === 0 ?
          '00' : Math.abs(this.getOffset(zone.datetime) % 60)
        // 代入時間資料
        zone.clickClock = `${localHour}:${minutes} - ${localHour + 1}:${minutes}`
        // 若遇換日: 代入日期資料
        const today = moment.parseZone(zone.datetime).format('ddd MMM DD')
        const nextDay = moment.parseZone(zone.nextDate).format('ddd MMM DD')
        zone.clickDatetime = '' // 先清空資料，避免連續點擊導致資料未修改
        if (localHour === 23) zone.clickDatetime = `${today} - ${nextDay}`
      })
    },
    hourUnClick() {
      // 關閉hour點擊區：取消遮色樣式(panelClicked: false)、移除點擊之時間資料
      this.hourClickedPanel.forEach(hour => hour.panelClicked = false)
      this.zonesPanelData = this.zonesPanelData.map(zone => {
        return zone = {
          ...zone,
          clickClock: '',
          clickDatetime: ''
        }
      })
    }
  },
  computed: {
    getHour() {
      return (datetime) => {
        // 取時間參數的小時「數字」
        return moment.parseZone(datetime).hour()
      }
    },
    getOffset() {
      return (datetime) => {
        // 取UTC時區時差的分鐘數
        return moment.parseZone(datetime).utcOffset()
      } 
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
    this.fetchPropsData(); //靜態資料
    this.getZonesData() //動態資料from API
    this.hourClickDefault() 
  },
  mounted() {
    document.addEventListener('click', this.hourUnClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hourUnClick);
  },
  watch: {
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