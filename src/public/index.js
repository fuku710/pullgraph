const ctx = document.getElementById('chart').getContext('2d')

const labels = []

let chart

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

function createDatasets(pulls, repos, labels, bgColors) {
  let datasets = []
  repos.forEach((repo, index) => {
    const data = labels.map((label) => {
      return pulls.filter((pull) => {
        const createdYearMonth =
          pull.createdAt.split('-')[0] + pull.createdAt.split('-')[1]
        return repo === pull.repo && label === createdYearMonth
      }).length
    })
    datasets.push({
      label: repo,
      data: data,
      backgroundColor: bgColors[index],
    })
  })
  return datasets
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(255))
}

function getRandomColorCode() {
  return (
    '#' +
    getRandomInt(255).toString(16).padStart(2, '0') +
    getRandomInt(255).toString(16).padStart(2, '0') +
    getRandomInt(255).toString(16).padStart(2, '0')
  )
}

function createColorPaletteElements(bgColors) {
  const root = document.querySelector('.color-input')
  root.innerHTML = ''
  bgColors.forEach((color) => {
    root.innerHTML += `<input type="color" value="${color}" />`
  })
}

function updateColors() {
  const newBgColors = Array.from(
    document.querySelector('.color-input').children
  ).map((elm) => elm.value)
  console.log(newBgColors)
  chart.config.data.datasets = chart.config.data.datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: newBgColors[index],
  }))
  chart.update()
}

axios
  .all([
    axios.get('http://localhost:1234/config'),
    axios.get('http://localhost:1234/pulls'),
  ])
  .then(
    axios.spread((config, pulls) => {
      console.log(config, pulls)
      const labels = createLabels(config.data.beginDate, config.data.endDate)
      const bgColors = config.data.repos.map((repo) => getRandomColorCode())
      console.log(bgColors)
      const datasets = createDatasets(
        pulls.data,
        config.data.repos,
        labels,
        bgColors
      )
      const options = {
        scales: {
          yAxes: [
            {
              stacked: true,
            },
          ],
          xAxes: [
            {
              stacked: true,
            },
          ],
        },
      }
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: options,
      })

      createColorPaletteElements(bgColors)
    })
  )
