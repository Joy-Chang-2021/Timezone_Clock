<template>
  <div id="app" class="container-xl px-4">
    <nav class="navbar navbar-light my-3 rounded" style="background-color: #e3f2fd;">
      <a class="navbar-brand mr-0" href="#">
        <i class="fa-solid fa-clock fa-lg mr-1"></i>
        <span class="navbar-brand m-0 h1 font-weight-bolder">Timezone</span>
      </a>
      <div>
        <button type="button" class="btn btn-outline-info">AM/PM</button>
        <button type="button" class="btn btn-outline-info ml-2">24HR</button>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  }
}
</script>


<style lang="scss">
@import "/src/scss/App.scss";
</style>