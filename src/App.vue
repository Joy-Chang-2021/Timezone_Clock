<template>
  <div id="app" class="container-xl">
    <nav class="navbar navbar-light my-3 rounded" style="background-color: #e3f2fd;">
      <a class="navbar-brand mr-0" href="#">
        <!-- TODO: ICON -->
        <img src="/docs/4.6/assets/brand/bootstrap-solid.svg" width="30" height="30" alt="">
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

<style lang="scss">
@import "/src/scss/App.scss";
</style>