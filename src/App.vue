<template>
  <div id="app" class="container-xl app-wrapper px-4">
    <nav class="navbar navbar-light mt-5 mb-4 rounded" style="background-color: #e3f2fd;">
      <a class="navbar-brand mr-0" href="#">
        <i class="fa-solid fa-clock fa-lg mr-1"></i>
        <span class="m-0 font-weight-bolder">Timezone Clcok</span>
      </a>
      <div>
        <button 
          @click="setTimeMode(false)"
          type="button"
          :class="['btn', [isWholeDayMode ? 'btn-outline-info' : 'btn-info']]"
        >
          AM/PM
        </button>
        <button
          @click="setTimeMode(true)"
          type="button"
          :class="['btn', 'ml-2', [isWholeDayMode ? 'btn-info' : 'btn-outline-info']]"
        >
          24HR
        </button>
      </div>
    </nav>
    <router-view :isWholeDayMode="isWholeDayMode" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isWholeDayMode: true
    }
  },
  methods: {
    setTimeMode(boolean) {
      this.isWholeDayMode = boolean
    }
  } 
}
</script>


<style lang="scss">
@import "/src/scss/App.scss";
</style>