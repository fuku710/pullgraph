<template>
  <div>
    <div v-for="repo in repos" :key="repo.name">
      <label>{{ repo.name }}</label>
      <input
        type="color"
        :value="repo.color"
        @change="e => $emit('change', e.target.value, repo.name)"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    repos: { type: Array, required: true }
  }
}
</script>