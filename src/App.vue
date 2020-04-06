<template>
  <div id="app">
    <Chart
      :pulls="pulls"
      :repos="repos"
      :beginDate="beginDate"
      :endDate="endDate"
      :bgColors="bgColors"
    ></Chart>
    <ColorSelector :colors="bgColors" @change="onChangeBgColor"></ColorSelector>
  </div>
</template>

<script>
import Chart from './components/Chart'
import ColorSelector from './components/ColorSelector'
import { fetchPulls } from './pulls'
import config from '../config.json'

export default {
  name: 'App',
  components: {
    Chart,
    ColorSelector
  },
  data: function() {
    return {
      pulls: [],
      repos: config.repos,
      beginDate: config.beginDate,
      endDate: config.endDate,
      bgColors: ['#999999', '#999999', '#999999']
    }
  },
  mounted: async function() {
    this.pulls = await fetchPulls()
  },
  methods: {
    onChangeBgColor(color, index) {
      this.$set(this.bgColors, index, color)
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    getRandomColorCode() {
      return (
        '#' +
        this.getRandomInt(255)
          .toString(16)
          .padStart(2, '0') +
        this.getRandomInt(255)
          .toString(16)
          .padStart(2, '0') +
        this.getRandomInt(255)
          .toString(16)
          .padStart(2, '0')
      )
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
