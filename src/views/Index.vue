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
          <ul class="nav nav-tabs" id="Tabs" role="tablist">
            <li
              v-for="index in 7"
              :key="index"
              class="nav-item"
              role="presentation"
              data-toggle="tooltip"
              :title="mainZoneData.datetime | dayChange(index - 2) | weeks"
            >
              <!-- TODO: different weeks filter due to class:active -->
              <!-- TODO: button: back to Today -->
              <a
                v-if="index === 2"
                class="nav-link active"
                :id="'tab-' + index"
                data-toggle="tab"
                href="#"
                role="tab"
                aria-controls="home"
                aria-selected="true"
                >
                {{ mainZoneData.datetime | dayChange(index - 2) | monthAndDay }}
              </a>
              <a
                v-else
                class="nav-link"
                :id="'tab-' + index"
                data-toggle="tab"
                href="#"
                role="tab"
                aria-controls="home"
                aria-selected="true"
                >
                {{ mainZoneData.datetime | dayChange(index - 2) | dayNumber }}
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
import Tables from "@/components/Tables.vue";
import worldTimeAPI from "../utils/worldTimeAPI";
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
    };
  },
  methods: {
    async getLocalTime(area, index) {
      try {
        // 取得 area 時區資料、存入 data
        const { data, status } = await worldTimeAPI.localTimeAPI(area);
        if (status != 200) throw new Error();
        data.index = index;
        if (data.timezone === this.mainZone) this.mainZoneData = data;
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
  },
  computed: {},
  created() {
    // TODO: 資料配合於輸入框顯示提示
    // this.getAllAreaList()
    this.zonesName.forEach((zone, index) => {
      this.getLocalTime(zone, index);
    });
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