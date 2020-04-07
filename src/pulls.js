import fetch from 'node-fetch'
import parse from 'parse-link-header'

export async function fetchPulls(token, repos, author, beginDate, endDate) {
  let results = []
  for (const repo of repos) {
    const query = buildSearchQuery({
      type: 'pr',
      repo: repo.name,
      author,
      beginDate,
      endDate,
    })
    let url = `https://api.github.com/search/issues?q=${query}`
    const options = {
      headers: { Authorization: `token ${token}` },
    }
    do {
      const res = await fetch(url, options)
      const link = parse(res.headers.get('link'))
      const json = await res.json()
      const items = json.items.map((item) => ({
        repo: repo.name,
        title: item.title,
        createdAt: item.created_at,
      }))
      results = [...results, ...items]
      if (link && link.next) {
        url = link.next.url
      } else {
        url = null
      }
    } while (url)
  }
  return results
}

function buildSearchQuery({ type, repo, author, beginDate, endDate }) {
  let query = ''
  if (type) query += `+type:${type}`
  if (repo) query += `+repo:${repo}`
  if (author) query += `+author:${author}`
  if (beginDate && endDate) query += `+created:${beginDate}..${endDate}`
  if (query[0] === '+') query.slice(1, -1)
  return query
}
