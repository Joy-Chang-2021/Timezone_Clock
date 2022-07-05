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
              <i class="fa-solid fa-house fa-2xs my-2"></i>
            </div>
            <div class="row mx-0 align-items-center w-100 list-height">
              <div class="col-2">{{ zone.raw_offset / 3600 | offSet }}</div>
              <div class="col-6 text-left">
                <h3 class="my-0 text-15">
                  <strong>{{ zone.timezone.split("/")[1] }}</strong>
                  <span class="text-black-50 text-12 ml-1">{{ zone.abbreviation }}</span>
                </h3>
                <p class="my-0 text-black-50 text-12">{{ zone.timezone.split("/")[0] }}</p>
              </div>
              <div class="col-4 text-right">
                <h3 class="my-0 text-black-50 text-15">{{ zone.datetime | wholeDayClock }}</h3>
                <p class="my-0 text-black-50 text-12">{{ zone.datetime | date }}</p>
              </div>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class="right flex-column scroll">
      <ul class="d-flex align-items-center my-0 w-100 list-height text-12 border-bottom">
        <li
          v-for="index in 24" :key="index"
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
          <p class="my-0 line-normal">24</p>
          <p class="my-0 line-normal">JUN</p>
        </li>
      </ul>
      <ul class="d-flex align-items-center my-0 w-100 list-height text-12 border-bottom">
        <li
          v-for="index in 24" :key="index"
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
          <p class="my-0 line-normal">24</p>
          <p class="my-0 line-normal">JUN</p>
        </li>
      </ul>
      <!-- <p>{{ '2022-07-04T02:47:21.430195+08:00'| wholeDayClock }}</p>
      <p>{{ '2022-07-04T00:17:21.430958+05:30'| wholeDayClock }}</p>
      <p>{{ '2022-07-04T03:47:21.431208+09:00'| wholeDayClock }}</p> -->
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import worldTimeAPI from "../utils/worldTimeAPI"
import { clockFilter, dateFillter, offSetFilter } from "../utils/moment"

export default {
  name: "Tables",
  components: {
    draggable,
  },
  mixins: [clockFilter, dateFillter, offSetFilter],
  props: {
    setZones: {
      type: Array,
      require: true,
    }
  },
  data() {
    return {
      zonesData: [],
      drag: false,
    };
  },
  methods: {
    async getLocalTime(area, index) {
      try {
        // 取得 area 時區資料、存入 data
        const { data, status } = await worldTimeAPI.localTimeAPI(area)
        if(status != 200) throw new Error()
        data.index = index
        this.zonesData.push(data)
      } catch (error) {
        console.log('error', error)
      }
    },
    dataFormat(list) {
      console.log(list)
      console.log('start mehtods')
      list.forEach(zone => {
        this.currentZones.push(zone)
      });
    }
  },
  computed: {
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
    this.setZones.forEach((zone, index) => {
      this.getLocalTime(zone, index)
    })
  }
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