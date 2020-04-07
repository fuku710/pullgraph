<template>
  <div>
    <canvas id="chart"></canvas>
    <button @click="downloadChart">download</button>
  </div>
</template>
<script>
import Chart from 'chart.js'
import { remote } from 'electron'
import fs from 'fs'

export default {
  props: {
    pulls: { type: Array, required: true },
    repos: { type: Array, required: true },
    beginDate: { type: String, required: true },
    endDate: { type: String, required: true }
  },
  data() {
    return {
      chart: null,
      options: {
        scales: {
          yAxes: [
            {
              stacked: true
            }
          ],
          xAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    }
  },
  computed: {
    labels() {
      const eDate = new Date(this.endDate)
      let date = new Date(this.beginDate)
      let labels = []
      while (date <= eDate) {
        const year = date.getFullYear().toString()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        labels.push(year + month)
        date.setMonth(date.getMonth() + 1)
      }
      return labels
    },
    datasets() {
      return this.repos.map(repo => {
        const data = this.labels.map(label => {
          return this.pulls.filter(pull => {
            const createdYearMonth =
              pull.createdAt.split('-')[0] + pull.createdAt.split('-')[1]
            return repo.name === pull.repo && label === createdYearMonth
          }).length
        })
        return {
          label: repo.name,
          data: data,
          backgroundColor: repo.color
        }
      })
    }
  },
  watch: {
    labels() {
      this.chart.data.labels = this.labels
      this.chart.update()
    },
    datasets() {
      this.chart.data.datasets = this.datasets
      this.chart.update()
    }
  },
  mounted() {
    this.createChart()
  },
  methods: {
    createChart() {
      const ctx = document.getElementById('chart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: this.datasets
        },
        options: this.options
      })
    },
    async downloadChart() {
      const base64 = document
        .getElementById('chart')
        .toDataURL('image/png')
        .replace('data:image/png;base64,', '')
      const { filePath, canceled } = await remote.dialog.showSaveDialog({
        title: 'Save graph',
        defaultPath: 'graph.png'
      })
      if (!canceled) {
        fs.writeFile(filePath, base64, { encoding: 'base64' }, err => {
          console.log(err)
        })
      }
    }
  }
}
</script>