<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      a: ''
    }
  },
  methods: {
    test () {
      console.log('1')
    }
  }
})
</script>

<style lang="scss">

</style>
