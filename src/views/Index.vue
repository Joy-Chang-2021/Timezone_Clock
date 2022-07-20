<template>
  <main>
    <table>
      <tr class="table-warning">
        <th class="left">
          <div class="input-group my-2 px-3">
            <div class="input-group-prepend">
              <button class="btn btn-warning" type="button" id="button-addon1">
                <i class="fa-solid fa-sort"></i>
              </button>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Place or Timezone"
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
            />
          </div>
        </th>
        <th class="right">
          <button type="button" class="btn btn-warning">
            <i class="fa-regular fa-calendar fa-xl"></i>
          </button>
          <ul class="nav nav-tabs" id="tableTabs">
            <li
              v-for="tab in tableTabs"
              :key="tab.day | weeks"
              class="nav-item"
              data-toggle="tooltip"
              :title="tab.day | weeks"
            >
              <!-- TODO: tooltip text: /today -->
              <!-- tab.active: true 標籤active狀態、顯示月份+日期 -->
              <a
                v-show="tab.active"
                @click.prevent="tabClicked(tab)"
                :class="['nav-link', 'text-nowrap', { active: tab.active }]"
                :id="tab.day | dayNumber"
                href="#"
              >
                {{ tab.day | monthAndDay }}
                <!-- 返回today按鈕: 當日不顯示 -->
                <i class="fa-solid fa-angles-left"
                  v-show="tab.day !== dayChange(mainZoneData.datetime, 0)"
                  @click.stop="backTodayClicked"
                ></i>
              </a>
              <!-- tab.active: false 顯示日期 -->
              <a
                v-show="!tab.active"
                @click.prevent="tabClicked(tab)"
                class="nav-link"
                :id="tab.day | dayNumber"
                href="#"
              >
                {{ tab.day | dayNumber }}
              </a>
              <!-- TODO: aria-controls/tab-content ? -->
            </li>
          </ul>
        </th>
      </tr>
    </table>
    <Tables
      :setMainZone="mainZone"
      :setZonesName="zonesName"
      :setMainZoneData="mainZoneData"
      :setZonesData="zonesData"
    />
  </main>
</template>

<script>
import $ from 'jquery'
import Tables from "@/components/Tables.vue";
import worldTimeAPI from "../utils/worldTimeAPI";
import moment from "moment";
import { dateFilter } from "../utils/moment";

export default {
  name: "Index",
  components: {
    Tables,
  },
  mixins: [dateFilter],
  data() {
    return {
      mainZone: "Asia/Taipei",
      zonesName: [
        "Asia/Taipei",
        "America/Belem",
        "Asia/Tokyo",
        "Asia/Tehran",
        "Asia/Kathmandu",
      ],
      mainZoneData: {},
      zonesData: [],
      tableTabs: [],
    };
  },
  methods: {
    async getLocalTime(area, index) {
      try {
        // 取得 area 時區資料、存入 data
        const { data, status } = await worldTimeAPI.localTimeAPI(area);
        if (status != 200) throw new Error();
        // 加入編號作為迴圈id使用
        data.index = index;
        // 加入主要時區data、呼叫table tabs資料函式
        if (data.timezone === this.mainZone) {
          this.mainZoneData = data;
          this.fetchTableTabs();
        }
        // 加入所有時區data
        this.zonesData.push(data);
      } catch (error) {
        console.log("error", error);
      }
    },
    async getAllAreaList() {
      try {
        const response = await worldTimeAPI.validAreaList();
        console.log(response);
      } catch (error) {
        console.log("error");
      }
    },
    dayChange(datetime, number) {
      // 修改日期: 加減天數
      return moment.parseZone(datetime).add(number, "days").format();
    },
    fetchTableTabs() {
      // 迴圈計算取得一週的日期，用於table tabs資料顯示
      // 七天: 前一天(-1)、當天(0)、後五天(1-5)
      for (let i = 1; i < 8; i++) {
        const datetime = this.dayChange(this.mainZoneData.datetime, i - 2);
        // tableTabs每筆資料 active初始狀態: 當天為 true、其餘為false
        if (i - 2 === 0) this.tableTabs.push({ day: datetime, active: true });
        else this.tableTabs.push({ day: datetime, active: false });
      }
    },
    tabClicked(tab) {
      // 控制 tableTabs每筆資料 active狀態 → 聯動樣式切換/渲染文字顯示
      // 點擊時，所有標籤active: false
      this.tableTabs.forEach((tab) => (tab.active = false));
      // 點擊目標之標籤active: true
      tab.active = true;
    },
    toolTipHide(element) {
      // 隱藏指定之 tooltip
      $(element).tooltip('hide')
    },
    backTodayClicked() {
      // TODO: 將data資料跳轉至「今日」: 尚未加入日歷效果
      const today = this.dayChange(this.mainZoneData.datetime, 0)
      this.tableTabs.forEach((tab) => {
        if(today === tab.day) tab.active = true
        else tab.active = false
      });
      // 隱藏被點擊元素之 tooltip (因跳轉時無法取消hover/focus的效果)
      const tooltipElement = event.target.parentElement.parentElement
      this.toolTipHide(tooltipElement)
    }
  },
  computed: {},
  created() {
    // TODO: 資料配合於輸入框顯示提示
    // this.getAllAreaList()
    this.zonesName.forEach((zone, index) => {
      this.getLocalTime(zone, index);
    });
    // this.fetchTableTabs()
  },
};
</script>


<style lang="scss" scoped>
.nav {
  transform: translate(4%, 13%);
  border-bottom: unset;
  flex-wrap: nowrap;
  a {
    color: black;
  }
}
</style>