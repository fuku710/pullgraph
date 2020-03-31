const fetch = require('node-fetch')
const parse = require('parse-link-header')

const config = require('./config.json')

const token = config.accessToken || null
const repos = config.repos || []
const author = config.author || null
const assignee = config.assignee || null
const beginDate = config.beginDate || '*'
const endDate = config.endDate || '*'

;(async () => {
  let results = []
  for (const repo of repos) {
    const query = buildSearchQuery({
      type: 'pr',
      repo,
      author,
      assignee,
      beginDate,
      endDate
    })
    let url = `https://api.github.com/search/issues?q=${query}`
    const options = {
      headers: { Authorization: `token ${token}` }
    }
    do {
      const res = await fetch(url, options)
      const link = parse(res.headers.get('link'))
      const json = await res.json()
      results = [
        ...results,
        ...json.items.map(
          item => `${repo},${item.title},${item.state},${item.created_at}`
        )
      ]
      if (link && link.next) {
        url = link.next.url
      } else {
        url = null
      }
    } while (url)
  }
  results.forEach(result => console.log(result))
  console.log(results.length)
})()

function buildSearchQuery({
  type,
  repo,
  author,
  assignee,
  beginDate,
  endDate
}) {
  let query = ''
  if (type) query += `+type:${type}`
  if (repo) query += `+repo:${repo}`
  if (author) query += `+author:${author}`
  if (assignee) query += `+assignee:${assignee}`
  if (beginDate && endDate) query += `+created:${beginDate}..${endDate}`
  if (query[0] === '+') query.slice(1, -1)
  return query
}
