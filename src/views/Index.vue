<template>
  <main>
    <table>
      <tr>
        <th class="left">搜尋欄</th>
        <th class="right">日期欄</th>
      </tr>
    </table>
    <Tables />
  </main>
</template>

<script>
import Tables from '@/components/Tables.vue'

export default {
  name: 'Index',
  components: {
    Tables
  }
}
</script>
