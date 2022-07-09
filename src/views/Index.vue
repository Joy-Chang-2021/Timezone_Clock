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
            <input type="text" class="form-control" placeholder="Place or Timezone" aria-label="Example text with button addon" aria-describedby="button-addon1">
          </div>
        </th>
        <th class="right">
          <button type="button" class="btn btn-warning">
            <i class="fa-regular fa-calendar fa-xl"></i>
          </button>
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">-1</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link active" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Today</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">+1</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">+1</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">+1</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">+1</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">+1</a>
            </li>
          </ul>
        </th>
      </tr>
    </table>
    <Tables :setMainZone="mainZone" :setZonesName="zonesName" :setMainZoneData="mainZoneData" :setZonesData="zonesData"/> 
  </main>
</template>

<script>
import Tables from '@/components/Tables.vue'
import worldTimeAPI from '../utils/worldTimeAPI'

export default {
  name: 'Index',
  components: {
    Tables
  },
  data() {
    return {
      mainZone: "Asia/Taipei",
      zonesName: ['Asia/Taipei', 'America/Belem', 'Asia/Tokyo', 'Asia/Tehran', 'Asia/Kathmandu'],
      mainZoneData: {},
      zonesData: []
    }
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
        const response = await worldTimeAPI.validAreaList()
        console.log(response)
      } catch (error) {
        console.log('error')
      }
    }
  },
  created() {
    // TODO: 資料配合於輸入框顯示提示
    // this.getAllAreaList()
    this.zonesName.forEach((zone, index) => {
      this.getLocalTime(zone, index);
    });
  }
}
</script>


<style lang="scss" scoped>
.nav {
  transform: translate(4%, 13%);
  border-bottom: unset;
  flex-wrap: nowrap;
  a {
    color:black;
  }
}
</style>