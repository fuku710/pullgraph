const express = require('express')

const fetchPulls = require('./pulls')
const config = require('../config.json')

const app = express()

app.use('/app', express.static(__dirname + '/public'))

app.get('/pulls', async (req, res) => {
  const pulls = await fetchPulls()
  res.json(pulls)
})

app.get('/config', async (req, res) => {
  res.json(config)
})

app.listen(1234, async () => {
  console.log('Listening on http://localhost:1234')
})
