<template>
  <div id="app">
    <button @click="toggleConfig">
      config
    </button>
    <button @click="fetchPulls">
      reload
    </button>
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
      ></Chart>
      <ColorSelector :repos="repos" @change="updateColor"></ColorSelector>
    </div>
  </div>
</template>

<script>
import Chart from './components/Chart'
import ColorSelector from './components/ColorSelector'
import ConfigInput from './components/ConfigInput'

import Store from 'electron-store'

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
      token: '',
      repos: [],
      author: '',
      beginDate: '',
      endDate: '',
      pulls: [],
      visibleConfig: false
    }
  },
  computed: {
    canFetch() {
      return (
        this.token !== '' &&
        this.repos.every(repo => repo.name !== '') &&
        this.author !== '' &&
        this.beginDate !== '' &&
        this.endDate !== ''
      )
    }
  },
  watch: {},
  mounted: async function() {
    const store = new Store()
    this.token = store.get('token')
    this.repos = store.get('repos')
    this.author = store.get('author')
    this.beginDate = store.get('beginDate')
    this.endDate = store.get('endDate')
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
      this.$set(this.repos, index, {
        name: value,
        color: this.repos[index].color || this.getRandomColorCode()
      })
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
    updateColor(color, name) {
      const index = this.repos.findIndex(repo => repo.name === name)
      this.$set(this.repos, index, { name, color })
    },
    toggleConfig() {
      this.visibleConfig = !this.visibleConfig
    },
    async saveConfig() {
      const store = new Store()
      store.set('token', this.token)
      store.set('repos', this.repos)
      store.set('author', this.author)
      store.set('beginDate', this.beginDate)
      store.set('endDate', this.endDate)
    },
    async fetchPulls() {
      this.pulls = await fetchPulls(
        this.token,
        this.repos,
        this.author,
        this.beginDate,
        this.endDate
      )
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
