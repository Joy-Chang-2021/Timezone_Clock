<template>
  <draggable
    class="list-group"
    tag="ul"
    v-model="list"
    v-bind="dragOptions"
    @start="drag = true"
    @end="drag = false"
  >
  <transition-group type="transition">
    <li v-for="element in list" :key="element.order" class="d-flex">
      <div class="left position-relative">
        <div class="setting">xx</div>
        <div class="row mx-0">
          <div class="col-2">+1</div>
          <div class="col-6">{{ element.name }}</div>
          <div class="col-4">time</div>
        </div>
      </div>
      <div class="right">24小時時間</div>
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
.setting {
  position: absolute;
  transform: translateX(-100%);
  padding: 0 10px;
}
// draggable css
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>