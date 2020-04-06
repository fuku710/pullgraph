<template>
  <div>
    <canvas id="chart"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'

export default {
  props: {
    pulls: { type: Array, required: true },
    repos: { type: Array, required: true },
    beginDate: { type: String, required: true },
    endDate: { type: String, required: true },
    bgColors: { type: Array, required: true }
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
            return repo === pull.repo && label === createdYearMonth
          }).length
        })
        return {
          label: repo,
          data: data
        }
      })
    }
  },
  watch: {
    labels() {
      this.refreshChart()
    },
    datasets() {
      this.refreshChart()
    },
    bgColors() {
      this.chart.data.datasets = this.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: this.bgColors[index]
      }))
      this.chart.update()
    }
  },
  mounted() {
    this.refreshChart()
  },
  methods: {
    refreshChart() {
      const ctx = document.getElementById('chart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: this.datasets
        },
        options: this.options
      })
    }
  }
}
</script>