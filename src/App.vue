<template>
  <div id="app">
    <ConfigInput
      v-if="visibleConfig"
      :token="token"
      :repos="repos"
      :author="author"
      :beginDate="beginDate"
      :endDate="endDate"
      @inputToken="updateToken"
      @inputRepo="updateRepository"
      @inputAuthor="updateAuthor"
      @inputBeginDate="updateBeginDate"
      @inputEndDate="updateEndDate"
      @clickAddRepo="addRepository"
      @clickRemoveRepo="removeRepository"
      @clickSave="saveConfig"
    />
    <div v-else>
      <Chart
        :pulls="pulls"
        :repos="repos"
        :beginDate="beginDate"
        :endDate="endDate"
        :bgColors="bgColors"
      ></Chart>
      <ColorSelector
        :colors="bgColors"
        @change="onChangeBgColor"
      ></ColorSelector>
    </div>
  </div>
</template>

<script>
import Chart from './components/Chart'
import ColorSelector from './components/ColorSelector'
import ConfigInput from './components/ConfigInput'

import { fetchPulls } from './pulls'

export default {
  name: 'App',
  components: {
    Chart,
    ColorSelector,
    ConfigInput
  },
  data: function() {
    return {
      pulls: [],
      token: '',
      repos: [],
      author: '',
      beginDate: '*',
      endDate: '*',
      bgColors: '',
      visibleConfig: false
    }
  },
  computed: {
    canFetch() {
      return (
        this.token !== '' &&
        this.repos.every(repo => repo !== '') &&
        this.author !== '' &&
        this.beginDate !== '' &&
        this.endDate !== ''
      )
    }
  },
  mounted: async function() {
    if (this.canFetch) {
      this.pulls = await fetchPulls(
        this.token,
        this.repos,
        this.author,
        this.beginDate,
        this.endDate
      )
    } else {
      this.visibleConfig = true
    }
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
    },
    addRepository() {
      this.repos.push('')
    },
    removeRepository(index) {
      this.repos.splice(index, 1)
    },
    updateToken(value) {
      this.token = value
    },
    updateRepository(value, index) {
      this.$set(this.repos, index, value)
    },
    updateAuthor(value) {
      this.author = value
    },
    updateBeginDate(value) {
      this.beginDate = value
    },
    updateEndDate(value) {
      this.endDate = value
    },
    async saveConfig() {
      if (this.canFetch) {
        this.visibleConfig = false
        this.pulls = await fetchPulls(
          this.token,
          this.repos,
          this.author,
          this.beginDate,
          this.endDate
        )
      } else {
        this.visibleConfig = true
      }
    }
  }
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
