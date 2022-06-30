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
    <Tables />
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
      zones: []
    }
  },
  methods: {
    async getLocalTime(area) {
      try {
        // 先以台北為預設
        const { data, status } = await worldTimeAPI.LocalTimeAPI(area)
        if(status != 200) throw new Error()
        const { timezone, abbreviation, datetime, day_of_week, utc_offset } = data
        this.zones.push({ timezone, abbreviation, datetime, day_of_week, utc_offset })
      } catch (error) {
        console.log('error', error)
      }
    }
  },
  created() {
    this.getLocalTime('Asia/Taipei')
    this.getLocalTime('Asia/Kolkata')
    this.getLocalTime('Asia/Tokyo')
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