<template>
  <main>
    <table>
      <tr class="table-warning">
        <th class="left">
          <div class="input-group my-2 px-3">
            <div class="input-group-prepend">
              <button class="btn btn-warning" type="button" @click="changeOrder">
                <i class="fa-solid fa-sort"></i>
              </button>
            </div>
            <input
              type="search"
              @keyup.enter="searchInputEntered"
              v-model="searchInput"
              name="searchInput"
              list="searchList"
              placeholder="enter and select a place"
              autocomplete="off"
              class="form-control"
            />
            <datalist id="searchList" v-if="!isLoading">
              <option v-for="item in fetchDatalist" :key="item.id" :data-value="item.value">
                {{ item.name }}
              </option>
            </datalist>
          </div>
        </th>
        <th class="right">
          <button type="button" class="btn btn-warning calendar-wrapper">
            <input type="date" id="calendar" v-model="calendarInput">
            <i class="fa-regular fa-calendar fa-xl"></i>
          </button>
          <ul class="nav nav-tabs" id="tableTabs">
            <li
              v-for="tab in tableTabs"
              :key="tab.id"
              class="nav-item w-100"
              data-toggle="tooltip"
              :title="tab.ofWeek"
            >
              <!-- tab.active: true 顯示月份+日期 -->
              <a
                v-if="tab.active"
                @click.prevent="tabClicked(tab)"
                :class="['nav-link', 'text-nowrap', {active: tab.active}]"
                href="#"
              >
                {{ tab.day | monthAndDay }}
                <!-- 返回today按鈕(當天不顯示) -->
                <i 
                  v-if="tab.ofWeek.length === 3"
                  @click.stop="backTodayClicked"
                  class="fa-solid fa-angles-left"
                ></i>
              </a>
              <!-- tab.active: false 顯示日期 -->
              <a
                v-else
                @click.prevent="tabClicked(tab)"
                class="nav-link"
                href="#"
              >
                {{ tab.day | day }}
              </a>
            </li>
          </ul>
        </th>
      </tr>
    </table>
    <Tables
      :isWholeDayMode="isWholeDayMode"
      :setZonesName="setZonesName"
      :setOrder="setOrder"
      :setTargetDate="setTargetDate"
      @mainZoneData="fetchMainZoneData"
    />
  </main>
</template>

<script>
import $ from 'jquery'
import { v4 as uuidv4 } from 'uuid';
import Tables from "@/components/Tables.vue";
import worldTimeAPI from "../utils/worldTimeAPI";
import moment from "moment";
import { dateFilter } from "../utils/moment";
import { Toast } from "../utils/helpers";

export default {
  name: "Index",
  components: {
    Tables,
  },
  mixins: [dateFilter],
  props: {
    isWholeDayMode: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      isLoading: false,
      setZonesName: [],
      mainZoneData: {},
      tableTabs: [],
      setOrder: false,
      calendarInput: '',
      setTargetDate: '',
      searchInput: '',
      setTargetLocation: '',
      apiAreaList: ['Africa', 'America', 'Antarctica', 'Asia', 'Atlantic', 'Australia', 'Europe', 'Indian', 'Pacific'],
      apiLocationList: [],
    };
  },
  methods: {
    async getApiLocationList() {
      try {
        this.isLoading = true
        const { data, status } = await worldTimeAPI.validAreaList();
        if(status !== 200) throw new Error()
        this.apiLocationList = data.filter(item =>
          // 保留包含apiAreaList地區的資料
          this.apiAreaList.includes(item.split('/')[0])
        )
        this.isLoading = false
      } catch (error) {
        console.log("error: ", error);
      }
    },
    dayChange(datetime, number) {
      // 修改日期: 加減天數
      return moment.parseZone(datetime).add(number, "days").format();
    },
    fetchMainZoneData(data) {
      this.mainZoneData = data
    },
    changeOrder() {
      this.setOrder = this.setOrder ? false : true
    },
    searchInputEntered() {
      if (!this.searchInput) return
      // 確認輸入字串為指定之資料(限定fetchDatalist之中)
      const validation = this.fetchDatalist.find(item =>  item.name === this.searchInput)
      // 確認輸入地區與現存地區(localStorage或初始資料)清單有無重複
      const localStorageData = JSON.parse(localStorage.getItem('timezoneProject'))
      const isRepeat = localStorageData.zonesName.some(zone => zone === validation.value)
      // 清除input表格顯示
      this.searchInput = ""
      if (!validation) {
        console.log('alert: wrong input')
        Toast.fire({
          icon: 'warning',
          title: '無此地區資料，請重新選取'
        })
      } else if(isRepeat) {
        Toast.fire({
          icon: 'warning',
          title: `已有此地區時間`
        })
      } else {
        // 輸入字串資料及格式正確，將api指定之資料格式(value)帶入zonesList及setZonesName向下傳至子元件
        localStorageData.zonesName.push(validation.value)
        this.setZonesName = localStorageData.zonesName
        // 將更新後的zonesList儲存至localStorage，使其保存最新的資料
        localStorage.setItem('timezoneProject', JSON.stringify(localStorageData))
      }
    },
    fetchTableTabs(datetime) {
      // 迴圈計算取得一週的日期，用於table tabs資料顯示
      // 七天: 前一天(-1)、參數當天(0)、後五天(1-5)
      const today = this.mainZoneData.datetime
      const array = []
      for (let i = -1; i <= 5; i++) {
        const day = this.dayChange(datetime, i); //轉換日期
        const isToday = moment(day).isSame(today, 'day') //辨識是否為今天
        const ofWeek = moment.parseZone(day).format('ddd') //轉換星期
        array.push({
          day,
          ofWeek: isToday ? `${ofWeek}/Today`: ofWeek,
          active: i === 0 ? true : false,
          id: uuidv4()
        })
      }
      this.tableTabs = array
    },
    tabClicked(tab) {
      // 控制 tableTabs每筆資料 active狀態 → 聯動樣式切換/渲染文字顯示
      // 點擊時，所有標籤active: false
      this.tableTabs.forEach((tab) => (tab.active = false));
      // 點擊目標之標籤active: true
      tab.active = true;
      // 將日期代入setTargetDate資料、傳入子層元件渲染畫面
      this.setTargetDate = moment.parseZone(tab.day).format('YYYY-MM-DD')
    },
    toolTipHide(element) {
      // 隱藏指定之 tooltip
      $(element).tooltip('hide')
    },
    backTodayClicked() {
      // 將data資料跳轉至「今日」
      this.fetchTableTabs(this.mainZoneData.datetime)
      this.setTargetDate = this.mainZoneData.datetime
      // 隱藏被點擊元素之tooltip (因跳轉時無法取消hover/focus的效果)
      this.toolTipHide(event.target.parentElement.parentElement)
    }
  },
  computed: {
    fetchDatalist() {
      return this.apiLocationList.map(item => {
        return {
          id: uuidv4(),
          value: item, // 用於api資料格式
          name: item.replaceAll('/', ', ').replaceAll('_', ' '), // 用於畫面顯示
        }
      })
    }
  },
  created() {
    const localStorageData = JSON.parse(localStorage.getItem('timezoneProject'))
    this.setZonesName = localStorageData ? localStorageData.zonesName : [
        "Pacific/Niue",
        "America/Belem",
        "Asia/Tehran",
        "Asia/Kathmandu",
        "Asia/Taipei",
        "Asia/Tokyo",
        "Australia/Adelaide",
        "Pacific/Nauru"
      ]
    this.getApiLocationList()
  },
  watch: {
    mainZoneData(newValue, oldValue) {
      // 子元素上傳data後，呼叫函式渲染tab資料
      if (newValue.datetime !== oldValue.datetime) this.fetchTableTabs(newValue.datetime)
    },
    calendarInput(value) {
      // 當點擊input日期: 傳入setTargetDate資料給子層元件、修改tab資料
      this.setTargetDate = value
      this.fetchTableTabs(value)
    }
  }
};
</script>


<style lang="scss" scoped>

</style>