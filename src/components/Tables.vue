<template>
  <div>
    <div class="d-flex" v-if="!this.isLoading">
      <div class="left">
        <draggable
          class="list-group"
          tag="ul"
          v-model="allZonesData"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group type="transition">
            <li
              v-for="zone in allZonesData"
              :key="zone.id"
              class="left-panel-wrapper border-bottom d-flex list-height position-relative"
            >
              <div class="setting-wrapper d-flex position-absolute list-height">
                <i class="fa-solid fa-circle-xmark fa-2xs my-2"
                  :class="{ 'd-none': zone.timezone === mainZone }"
                  @click="deleteTargetZone(zone.timezone)"
                ></i>
                <i
                  class="home fa-solid fa-house fa-2xs my-2"
                  :class="{ 'd-none': zone.timezone === mainZone }"
                  @click="changeMainZone(zone.timezone)"
                ></i>
              </div>
              <div class="mx-0 d-flex align-items-center w-100 list-height position-relative">
                <div class="dst-wrapper font-weight-bold">
                  <!-- 各區標準時差 -->
                  {{ getOffset(zone.datetime) / 60 | symbol }}
                </div>
                <div class="location-wrapper text-left">
                  <h3 class="d-inline my-0 text-nowrap text-16 font-weight-bold">
                    <!-- 城市名 -->
                    {{ zone.city }}
                  </h3>
                  <span class="abbreviation ml-1">
                    <!-- 時差縮寫 -->
                    {{ zone.abbreviation }}
                  </span>
                  <p class="my-0">
                    <!-- 國家/地區名 -->
                    {{ zone.country }}
                  </p>
                </div>
                <div class="time-wrapper text-right">
                  <h3 v-if ="zone.clickClock" class="my-0 text-16 font-weight-bold">
                    <!-- 當點擊目標時間時: 顯示所選時間 -->
                    {{ zone.clickClock }}
                  </h3>
                  <h3 v-else-if="targetDate" class="my-0 text-16 font-weight-bold">
                    <!-- 當點擊目標日期時: 顯示主時區目標日期的00:00時間 -->
                    {{ zone.beginPoint | clockMode(isWholeDayMode) }}
                  </h3>
                  <h3 v-else class="my-0 text-16 font-weight-bold">
                    <!-- default: 當地時間 -->
                    {{ zone.datetime | clockMode(isWholeDayMode) }}
                  </h3>
                  <p v-if="zone.clickDatetime" class="my-0 clickedDate">
                    <!-- 當點擊目標時間時: 顯示所選日期(可能換日) -->
                    {{ zone.clickDatetime }}
                  </p>
                  <p v-else-if ="targetDate" class="my-0">
                    <!-- 當點擊目標日期時: 顯示主時區目標日期 -->
                    {{ zone.beginPoint | dateDetail }}
                  </p>
                  <p v-else class="my-0">
                    <!-- default: 當地日期 -->
                    {{ zone.datetime | dateDetail }}
                  </p>
                </div>
              </div>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="right right-panel-wrapper flex-column position-relative">
        <div class="background-wrapper position-absolute w-100 h-100 py-4">
          <ul class="d-flex m-0 h-100" v-if="targetDate.length === 0">
            <li
              v-for="index in 24"
              :key="index"
              :class="[
                'hour-li',
                {'hour-today': getHour(mainZoneData.datetime) === index - 1}
              ]"
            >
            &nbsp;
            </li>
          </ul>
        </div>
        <div>
          <ul
            v-for="zone in allZonesData"
            :key="zone.timezone"
            class="
              d-flex
              align-items-center
              position-relative
              my-0
              w-100
              list-height
              border-bottom
            "
          >
            <li
              v-for="index in 24"
              :key="index"
              class="
                hour-li
                h-50
                d-flex
                flex-column
              "
            >
              <div 
                class="h-100 d-flex flex-column justify-content-center"
                :class="[
                (getHour(zone.beginPoint) + index - 1) % 24 < 7 ||
                (getHour(zone.beginPoint) + index - 1) % 24 >= 19 ?
                'hour-night' : 'hour-day',
                {'hour-begin': (getHour(zone.beginPoint) + index - 1) % 24 === 0},
                {'hour-end': (getHour(zone.beginPoint) + index - 1) % 24 === 23}
                ]"
              >
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
                  <p class="my-0 line-normal" :class="{'hourText-forCenter': getOffset(zone.beginPoint) % 60}">
                    {{ getHour(zone.beginPoint) + index - 1 | hourPanelMode(24) }}
                  </p>
                  <sub v-show ="getOffset(zone.beginPoint) % 60" class="my-0 line-normal">
                    {{ getOffset(zone.beginPoint) % 60 }}
                  </sub>
                </template>
                <!-- 非00點: 顯示12am/pm -->
                <template v-else>
                  <p class="my-0 line-normal hourText-forCenter">
                    <span>
                      {{ getHour(zone.beginPoint) + index - 1 | hourPanelMode(12) }}
                    </span>
                    <sub
                      v-show ="getOffset(zone.beginPoint) % 60"
                      class="subText"
                    >
                      {{ getOffset(zone.beginPoint) % 60 }}
                    </sub>
                  </p>               
                  <sub class="my-0 line-normal">
                    {{ getHour(zone.beginPoint) + index - 1 | hourStatus }}
                  </sub>
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
                'hour-li',
                'hour-hover',
                {'hour-outside-clicked': hour.panelClicked},
                {'border border-dark rounded': !hour.panelClicked && hourClickedPanel.some(hour => hour.panelClicked)}
              ]"
            >
            &nbsp;
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="spinner-border text-secondary mt-4" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
import worldTimeAPI from "../utils/worldTimeAPI";
import { v4 as uuidv4 } from 'uuid';
import { Toast } from "../utils/helpers";
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
    setZonesName: {
      type: Array,
      require: true,
    },
    setOrder: {
      type: Boolean
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
      allZonesData: [],
      hourClickedPanel: [],
      targetDate: "",
      // zonesData僅用於allZonesData順序或時區清單改變時，儲存修改後的資料並傳至localStorage
      zonesName: [],
      drag: false,
    };
  },
  methods: {
    setZonesInitialData(nameList) {
      // 父層與API無關之靜態資料：分別用於v-for渲染、點擊0-24時間點的面板渲染
      nameList.forEach((name, index) => {
        // 時區縮寫：可由moment-timezone套件取得
        const abbreviation = moment.tz(name).zoneAbbr()
        // 城市名、國家地區名：由namelist清單內各自的名稱切割而成
        const country = name.split('/').length > 2 ? 
          name.split('/')[0] + ' ' + name.split('/')[1] :
          name.split('/')[0]
        const city = name.split('/').length > 2 ?
          name.split('/')[2] : name.split('/')[1]
        // 建立所有時區之初始靜待資料：
        this.allZonesData[index] = {
          id: uuidv4(),
          timezone: name,
          abbreviation,
          country,
          city: city.replaceAll('_', ' '),
          clickClock: '',
          clickDatetime: ''
        }
      })
    },
    async getZoneApiData(mainZone) {
      try {
        this.isLoading = true
        // 取得主要時區API資料
        const { data, status } = await worldTimeAPI.localTimeAPI(mainZone)
        if (status !== 200) throw new Error()
        const { abbreviation, datetime } = data
        // 主要時區資料: 存入data、呼叫函式(設定面板渲染資料、上傳至父元件tabs渲染資料)
        this.mainZoneData = { abbreviation, datetime, timezone: mainZone }
        // 表格左側資料：根據主時區時間，轉換其他時區的當地時間
        this.setClockPanelData(this.setZonesName)
        this.setHoursPanelData(datetime)
        this.emitMainZoneData(this.mainZoneData)
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log("error", error);
        Toast.fire({
          icon: 'warning',
          title: '無法取得資料，請稍後再試'
        })
      }
    },
    setClockPanelData(nameList) {
      // 用於表格左側的渲染資料
      // 將主時區的時間傳換成其他時區的當地時間
      const rawDatetime = this.mainZoneData.datetime
      for (const name of nameList) {
        const datetime = moment.parseZone(rawDatetime).tz(name).format()
        this.allZonesData = this.allZonesData.map(zone => {
          if (name !== zone.timezone) return zone
          else return zone = {
            ...zone,
            datetime,
          }
        })
      }
    },
    setHoursPanelData(datetime) {
      // 用於表格右側的渲染資料
      // 根據代入參數(指定之日期時間)，增加各時區資料中的beginPoint、nextDate資料，用以渲染畫面
      const targetDate = moment.parseZone(datetime).format('YYYY-MM-DD')
      const mainZoneMidnight = moment.tz(targetDate, this.mainZone).format()
      // 迴圈所有時區beginPoint、nextDate資料
      this.allZonesData = this.allZonesData.map(zone => {
        // 將參數時區00:00轉換為當地時區的「第一格」時間點
        const beginPoint = moment(mainZoneMidnight).tz(zone.timezone).format()
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
    changeMainZone(zoneName) {
      this.mainZone = zoneName
      this.getZoneApiData(this.mainZone)
    },
    deleteTargetZone(zoneName) {
      // 修改子元件中儲存的資料(並不重新向api取得資料)
      this.allZonesData = this.allZonesData.filter(zone => zone.timezone !== zoneName)
    },
    arrangeOrder(boolean) {
      // 根據時區的GMT-12至GMT+12順序，轉換時區的升冪或降冪排序
      if (boolean) this.allZonesData.sort((a, b) => {
        // 「升序」排序
        return this.getOffset(a.datetime) - this.getOffset(b.datetime)
      })
      else this.allZonesData.sort((a, b) => {
        // 「降序」排序
        return this.getOffset(b.datetime) - this.getOffset(a.datetime)
      })
    },
    saveToLocalStorage() {
      // 儲存主時區名稱、所有時區的名稱/順序至localStorage
      const rawData = {
        mainZone: this.mainZone,
        zonesName: this.zonesName
      }
      localStorage.setItem('timezoneProject', JSON.stringify(rawData))
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
      this.allZonesData.map(zone => {
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
      this.allZonesData.forEach(zone => {
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
    // 設定靜態資料 (1) allZonesData相關 (2) mainZone相關
    this.setZonesInitialData(this.setZonesName);
    const localStorageData = JSON.parse(localStorage.getItem('timezoneProject'))
    this.mainZone = localStorageData ? localStorageData.mainZone : "Asia/Taipei"
    // 動態資料from API
    this.getZoneApiData(this.mainZone)
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
      // this.getZoneApiData(this.mainZone, value)
      this.setClockPanelData(value)
      this.setHoursPanelData(this.mainZone.datetime)
    },
    allZonesData(value) {
      // 過濾掉create階段的變化
      if (this.isLoading) return
      else {
        // 當allZonesData資料改變(ex順序拖曳)：存入zonesName並呼叫函式將資料存入localStorage
        this.zonesName = value.map(zone => zone.timezone)
        this.saveToLocalStorage()
      }
    },
    setOrder(value) {
      // 父元件的排序按鈕啟動，呼叫根據時區升降冪排序的函式
      this.arrangeOrder(value)
    },
    setTargetDate(value) {
      // 若指定日期與主時區當天日期相同，則將targetDate清空，DOM畫面(表格左側)顯示api原始資料即可
      if(moment(this.mainZoneData.datetime).isSame(value, 'day')) this.targetDate = ""
      // 若指定日期與主時區當天日期不相同，代入targetDate資料，DOM判斷資料狀態後渲染畫面
      else this.targetDate = value
      // 仍須每次根據目標日期呼叫函式修改beginPoint、nextDate資料(表格右側)
      this.setHoursPanelData(value)
    },
  },
};
</script>