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
              <i class="fa-solid fa-circle-xmark fa-2xs my-2"
                :class="{ 'd-none': zone.timezone === mainZone }"
                @click="deleteTargetZone(zone.timezone)"
              ></i>
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
                <h3 v-else-if="targetDate" class="my-0 text-black-50 text-15">
                  <!-- 當點擊目標日期時: 顯示主時區目標日期的00:00時間 -->
                  {{ zone.beginPoint | clockMode(isWholeDayMode) }}
                </h3>
                <h3 v-else class="my-0 text-black-50 text-15">
                  <!-- default: 當地時間 -->
                  {{ zone.datetime | clockMode(isWholeDayMode) }}
                </h3>
                <p v-if="zone.clickDatetime" class="my-0 text-black-50 text-12">
                  <!-- 當點擊目標時間時: 顯示所選日期 -->
                  {{ zone.clickDatetime }}
                </p>
                <p v-else-if ="targetDate" class="my-0 text-black-50 text-12">
                  <!-- 當點擊目標日期時: 顯示主時區目標日期 -->
                  {{ zone.beginPoint | dateDetail }}
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
        <ul class="d-flex m-0 h-100" v-if="targetDate.length === 0">
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
              <!-- 24點: 顯示換日日期 -->
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
              <!-- 非00點: 顯示24hrs -->
              <template v-else-if="isWholeDayMode">
                <p class="my-0 line-normal">
                  {{ getHour(zone.beginPoint) + index - 1 | hourPanelMode(24) }}
                </p>
                <p v-show ="getOffset(zone.beginPoint) % 60" class="my-0 line-normal">
                  {{ getOffset(zone.beginPoint) % 60 }}
                </p>
              </template>
              <!-- 非00點: 顯示12am/pm -->
              <template v-else>
                <p class="my-0 line-normal">
                  {{ getHour(zone.beginPoint) + index - 1 | hourPanelMode(12) }}
                  <sub v-show ="getOffset(zone.beginPoint) % 60">
                    {{ getOffset(zone.beginPoint) % 60 }}
                  </sub>
                </p>
                <p class="my-0 line-normal">
                  {{ getHour(zone.beginPoint) + index - 1 | hourStatus }}
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
    isWholeDayMode: {
      type: Boolean,
      require: true
    },
    setMainZone: {
      type: String,
      require: true,
    },
    setZonesName: {
      type: Array,
      require: true,
    },
    setTargetDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: false,
      mainZone: "",
      mainZoneData: {},
      targetDate: "",
      zonesName: [],
      zonesPanelData: [],
      hourClickedPanel: [],
      drag: false,
    };
  },
  methods: {
    setZonesInitialData(nameList) {
      // 父層與API無關之靜態資料
      nameList.forEach((zone, index) => {
        // 所有時區之靜態資料，分別用於v-for渲染、點擊0-24時間點的面板渲染
        this.zonesPanelData[index] = {
          id: uuidv4(),
          timezone: zone,
          clickClock: '',
          clickDatetime: ''
        }
      })
    },
    async getZonesData(nameList) {
      try {
        this.isLoading = true
        // 將指定陣列的資料迴圈向api取得指定地區資料
        for (const name of nameList) {
          const { data, status } = await worldTimeAPI.localTimeAPI(name)
          if (status != 200) throw new Error()
          const { abbreviation, datetime, dst } = data
          // 將取得資料存入zonesPanelData
          this.zonesPanelData = this.zonesPanelData.map(zone => {
            if (name !== zone.timezone) return zone
            else return zone = {
              ...zone,
              abbreviation, datetime, dst,
              city: name.split('/')[1],
              country: name.split('/')[0]
            }
          })
          // 若api資料為主時區資料：
          if (name === this.mainZone) {
            this.mainZoneData = {
              abbreviation, datetime, dst, timezone: this.mainZone
            }
            // 代入函式：計算個各時區時差資料、上傳至父元件渲染當週tabs
            this.setHoursPanelData(datetime)
            this.emitMainZoneData(this.mainZoneData)
          }
        }
        this.isLoading = false
      } catch (error) {
        console.log("error", error);
      }
    },
    setHoursPanelData(datetime) {
      // 根據代入參數(指定地區之日期時間)，增加各時區資料中的beginPoint、nextDate資料，用以渲染畫面
      const day = moment.parseZone(datetime).format('YYYY-MM-DD')
      // 迴圈所有時區beginPoint、nextDate資料
      this.zonesPanelData = this.zonesPanelData.map(zone => {
        // 將參數時區00:00轉換為當地時區的「第一格」時間點
        const beginPoint = moment(day).tz(zone.timezone).format()
        // 每個時區須換日時的資料，主要須月份/日期/星期資料
        const nextDate = moment.parseZone(beginPoint).add(1, 'd').format()
        return zone = {
          ...zone,
          beginPoint,
          nextDate
        }
      })
    },
    emitMainZoneData(data) {
      // 將主時區資料傳至父層元件，用以渲染 1week tab畫面
      this.$emit('mainZoneData', data)
    },
    deleteTargetZone(zoneName) {
      // 修改子元件中儲存的資料(並不重新向api取得資料)
      this.zonesPanelData = this.zonesPanelData.filter(zone => zone.timezone !== zoneName)
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
    hourClickedData(target) {
      // 取出點擊時間之index
      const index = target.hourIndex
      // 迴圈計算各時區之點擊時間
      this.zonesPanelData.map(zone => {
        // ==== 計算之資料 ====
        // 各時區的「被點擊的那一格」時間點
        let localHour = moment.parseZone(zone.beginPoint).hour() + index
        const targetHour = localHour % 24
        const nextHour = (localHour + 1) % 24
        // 計算分鐘數字
        const minutes = this.getOffset(zone.datetime) % 60 ?
          Math.abs(this.getOffset(zone.datetime) % 60) : '00'
        // 取得當日、隔日資料格式 
        const beginDay = moment.parseZone(zone.beginPoint).format('ddd MMM DD')
        const nextDay = moment.parseZone(zone.nextDate).format('ddd MMM DD')
        // ==== 渲染畫面之資料 ====
        // 代入(表格左側)預計顯示之時間資料
        if (this.isWholeDayMode) {
          zone.clickClock = `${targetHour}:${minutes} - ${nextHour}:${minutes}`
        } else {
          const dayOneMode = targetHour < 12 ? 'am' : 'pm'
          const dayTwoMode = nextHour < 12 ? 'am' : 'pm'
          zone.clickClock = `${targetHour % 12}:${minutes} ${dayOneMode} - ${nextHour % 12}:${minutes} ${dayTwoMode}`
        }
        // 若「被點擊的那一格」遇換日or已換日: 代入日期資料
        zone.clickDatetime = '' // 先清空資料，避免連續點擊導致資料未修改
        if(localHour === 23) zone.clickDatetime = `${beginDay} - ${nextDay}`
        else if (localHour >= 24) zone.clickDatetime = `${nextDay}`
      })
    },
    hourUnClick() {
      // 關閉hour點擊區：取消遮色樣式(panelClicked: false)、移除點擊之時間資料
      this.hourClickedPanel.forEach(hour => hour.panelClicked = false)
      this.zonesPanelData.forEach(zone => {
        zone.clickClock = ""
        zone.clickDatetime =""
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
    this.mainZone = this.setMainZone;
    //設定靜態資料
    this.setZonesInitialData(this.setZonesName); 
    // 動態資料from API
    this.getZonesData(this.setZonesName)
    this.hourClickDefault() //生成24小時面板點擊區
  },
  mounted() {
    // 於整份網頁文件放置監聽器
    document.addEventListener('click', this.hourUnClick);
  },
  beforeDestroy() {
    // 於vue實例銷毀前、將網頁文件上的監聽器銷毀
    document.removeEventListener('click', this.hourUnClick);
  },
  watch: {
    setZonesName(value) {
      // 當父元件資料改變，重新向api取得所有地區時間資料
      // 設定靜態資料
      this.setZonesInitialData(value); 
      // 動態資料from API
      this.getZonesData(value)
    },
    zonesPanelData(value) {
      // 過濾掉create階段的變化
      if (this.isLoading) return
      // 當zonesPanelData資料改變(ex順序拖曳)：存入zonesName並存至localStorage
      else this.zonesName = value.map(zone => zone.timezone)
    },
    zonesName(value) {
      // 修改localStorage中儲存的資料(父元件在處理資料時可由localStorage取得最新資料)
      localStorage.setItem('saveZonesList', JSON.stringify(value))
    },
    setTargetDate(value) {
      // 若指定日期與主時區當天日期相同，則將targetDate清空，DOM畫面(表格左側)顯示api原始資料即可
      if(moment(this.mainZoneData.datetime).isSame(value, 'day')) this.targetDate = ""
      // 若指定日期與主時區當天日期不相同，代入targetDate資料，DOM判斷資料狀態後渲染畫面
      else this.targetDate = value
      // 仍須每次根據目標日期呼叫函式修改beginPoint、nextDate資料(表格右側)
      this.setHoursData(value)
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