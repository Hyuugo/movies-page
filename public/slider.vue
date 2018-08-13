<template>
  <div>
    <vue-slider ref="slider" v-model="value"></vue-slider>
  </div>
</template>

<script>

import vueSlider from 'public'

new Vue({
  el: '#slider',
  components: {
    vueSlider
  },
  data: {
    value: 1
  }
});
</script>