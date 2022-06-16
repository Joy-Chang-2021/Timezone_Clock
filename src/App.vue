<template>
  <div id="app" class="container-xl">
    <nav class="navbar navbar-light my-3 rounded" style="background-color: #e3f2fd;">
      <a class="navbar-brand mr-0" href="#">
        <i class="fa-solid fa-clock fa-lg"></i>
        <span class="navbar-brand mb-0 ml-2 h1 font-weight-bolder">Timezone</span>
      </a>
      <div>
        <button type="button" class="btn btn-outline-info ml-2">AM/PM</button>
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