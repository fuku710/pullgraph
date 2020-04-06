<template>
  <div>
    <input
      v-for="(color, index) in colors"
      type="color"
      :value="color"
      :key="index"
      @change="e => $emit('change', e.target.value, index)"
    />
  </div>
</template>
<script>
export default {
  props: {
    colors: { type: Array, required: true }
  }
}
</script>