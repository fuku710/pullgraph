const ctx = document.getElementById('chart').getContext('2d')

const labels = []

const data = [1, 2, 3, 4, 5]

function createLabels(beginDate, endDate) {
  const eDate = new Date(endDate)

  let date = new Date(beginDate)
  let labels = []

  while (date <= eDate) {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    labels.push(year + month)
    date.setMonth(date.getMonth() + 1)
  }

  return labels
}

function createDatasets(pulls, repos, labels) {
  let datasets = []
  repos.forEach(repo => {
    const data = labels.map(label => {
      return pulls.filter(pull => {
        const createdYearMonth =
          pull.createdAt.split('-')[0] + pull.createdAt.split('-')[1]
        return repo === pull.repo && label === createdYearMonth
      }).length
    })
    datasets.push({
      label: repo,
      data: data,
      backgroundColor: `rgb(
        ${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(255)}
      )`
    })
  })
  return datasets
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(255))
}

axios
  .all([
    axios.get('http://localhost:1234/config'),
    axios.get('http://localhost:1234/pulls')
  ])
  .then(
    axios.spread((config, pulls) => {
      console.log(config, pulls)
      const labels = createLabels(config.data.beginDate, config.data.endDate)
      const datasets = createDatasets(pulls.data, config.data.repos, labels)
      console.log(datasets)
      const options = {
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
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: options
      })
    })
  )
