const fetch = require('node-fetch')
const parse = require('parse-link-header')

const config = require('./config.json')

const repos = config.repos || []
const token = config.accessToken || ''
const assignee = config.assignee || ''
const beginDate = config.beginDate || '*'
const endDate = config.endDate || '*'

;(async () => {
  let results = []
  for (const repo of repos) {
    let url = `https://api.github.com/search/issues?q=type:pr+assignee:${assignee}+repo:${repo}+created:${beginDate}..${endDate}`
    const options = {
      headers: { Authorization: `token ${token}` }
    }
    do {
      const res = await fetch(url, options)
      const link = parse(res.headers.get('link'))
      const json = await res.json()
      results = [
        ...results,
        ...json.items.map(item => `${repo},${item.title},${item.created_at}`)
      ]
      if (link && link.next) {
        url = link.next.url
      } else {
        url = null
      }
    } while (url)
  }
  console.log('repository,title,created_at')
  results.forEach(result => console.log(result))
})()
