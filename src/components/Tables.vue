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
                {{ localOffSet(zone.datetime) | symbol("+") }}
              </div>
              <div class="col-6 text-left">
                <h3 class="my-0 text-15">
                  <strong>{{ zone.timezone.split("/")[1] }}</strong>
                  <span class="text-black-50 text-12 ml-1">{{
                    zone.abbreviation
                  }}</span>
                </h3>
                <!-- TODO: change to country name -->
                <p class="my-0 text-black-50 text-12">
                  {{ zone.timezone.split("/")[0] }}
                </p>
              </div>
              <div class="col-4 text-right">
                <h3 class="my-0 text-black-50 text-15">
                  {{ zone.datetime | wholeDayClock }}
                </h3>
                <p class="my-0 text-black-50 text-12">
                  {{ zone.datetime | dateDetail }}
                </p>
              </div>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class="right flex-column scroll">
      <ul
        v-for="zone in zonesData"
        :key="zone.index"
        class="
          d-flex
          align-items-center
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
            border border-primary
            d-flex
            flex-column
            justify-content-center
            align-items-center
          "
        >
          <!-- 非整數時差 -->
          <div v-if="timeLagCompared(zone.datetime) % 1">
            <!-- 0點 -->
            <template v-if="firstDayCheck(zone.datetime, order - 1)">
              <p class="my-0 line-normal position-absolute weekdays-panel">{{ changeDay(zone.datetime) | weeks }}</p>
              <p class="my-0 line-normal">{{ changeDay(zone.datetime) | month }}</p>
              <p class="my-0 line-normal">{{ changeDay(zone.datetime)| day }}</p>
            </template>
            <!-- 1-23點 -->
            <template v-else>
              <p class="my-0 line-normal">
                {{ parseInt(timeLagCompared(zone.datetime)) + order - 2 | wholeDayPanel}}
              </p>
              <p class="my-0 line-normal">
                {{ zone.datetime | getMinutes | symbol("") }}
              </p>
            </template>
          </div>
          <!-- 整數時差 -->
          <div v-else>
            <!-- 0點 -->
            <template v-if="firstDayCheck(zone.datetime, order)">
              <p class="my-0 line-normal position-absolute weekdays-panel">{{ changeDay(zone.datetime) | weeks }}</p>
              <p class="my-0 line-normal">{{ changeDay(zone.datetime) | month }}</p>
              <p class="my-0 line-normal">{{ changeDay(zone.datetime)| day }}</p>
            </template>
            <!-- 1-23點 -->
            <template v-else>
              <p class="my-0 line-normal">
                {{ parseInt(timeLagCompared(zone.datetime)) + order - 1 | wholeDayPanel}}
              </p>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import moment from "moment";
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
      require: true
    },
    setZonesName: {
      type: Array,
      require: true
    },
    setMainZoneData: {
      type: Object,
      require: true
    },
    setZonesData: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      zonesName: [],
      zonesData: [],
      mainZone: "",
      mainZoneData: {},
      drag: false,
    };
  },
  methods: {
    setPropsData() {
      this.mainZone = this.setMainZone
      this.zonesName = this.setZonesName
      this.mainZoneData = this.setMainZoneData
      this.zonesData = this.setZonesData
    }
  },
  computed: {
    localOffSet() {
      return (datetime) => {
        // 計算當地時間的UTC偏移量(已含日光節約時間), 單位hr
        return moment.parseZone(datetime).utcOffset() / 60;
      };
    },
    timeLagCompared() {
      return (datetime) => {
        // 計算兩地時差: 其他地區的UTC offset - 基準地區UTC offset
        return this.localOffSet(datetime) -
          this.localOffSet(this.mainZoneData.datetime)
      };
    },
    firstDayCheck() {
      return (datetime, order) => {
        // 辨識0時/24時以顯示月份日期：兩地時差 + 格子序(1-24) - 標準地格子序(1)
        if (parseInt(this.timeLagCompared(datetime)) + order - 1 === 0) return true
        else if (parseInt(this.timeLagCompared(datetime)) + order - 1 === 24) return true
        else return false
      }
    },
    changeDay() {
      return (datetime) => {
        // 0點顯示日期，須換日 & 不須換日
        const timeLag = this.timeLagCompared(datetime)
        if (timeLag > 0) return moment.parseZone(datetime).add(1, 'days')
        else return datetime
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
    this.setPropsData()
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
// draggable css
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>