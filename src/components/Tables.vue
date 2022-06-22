<template>
  <draggable
    class="list-group"
    tag="ul"
    v-model="list"
    v-bind="dragOptions"
    @start="drag = true"
    @end="drag = false"
  >
  <!-- TODO: ul / li border 調整 -->
  <transition-group type="transition">
    <li v-for="element in list" :key="element.order"  class="border-bottom d-flex list-height">
      <div class="left position-relative">
        <div class="setting d-flex position-absolute list-height">
          <i class="fa-solid fa-circle-xmark fa-2xs my-2"></i>
          <i class="fa-solid fa-house fa-2xs  my-2"></i>
        </div>
        <div class="row mx-0 align-items-center list-height">
          <div class="col-2">+1</div>
          <div class="col-6 text-left">
            <h3 class="my-0 text-15">
              <strong>{{ element.name }}</strong>
              <span class="text-black-50 text-12 ml-1">XXX</span>
            </h3>
            <p class="my-0 text-black-50 text-12">place place place</p>
          </div>
          <div class="col-4 text-right">
            <h3 class="my-0 text-black-50 text-15">00:00</h3>
            <p class="my-0 text-black-50 text-12">date date</p>
          </div>
        </div>
      </div>
      <div class="right">
        <ul class="d-flex w-100 h-50 text-12">
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
          <li class="w-100 border border-primary d-flex flex-column justify-content-center align-items-center">
            <p class="my-0 line-normal">24</p>
            <p class="my-0 line-normal">JUN</p>
          </li>
        </ul>
      </div>
    </li>
  </transition-group>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';

const sample = [
  "AAA",
  "BBB",
  "CCC"
]

export default {
  name: 'Tables',
  components: {
    draggable
  },
  data() {
    return {
      list: sample.map((name, index) => {
        return { name, order: index + 1}
      }),
      drag: false
    }
  },
  methods: {
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
}
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
// draggable css
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>