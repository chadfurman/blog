module.exports = new Promise(async (resolve) => {
  try {
    const response = await fetch(`http://localhost:1337/api/articles?populate[0]=blocks`);
    const results = (await response.json()).data
    const images = []
    if (results) {
      results.forEach(result => {
        result.blocks.forEach(block => {
          if (block.__component === "shared.rich-text") {
            const matches = block.body.matchAll(/!\[.*?\]\(([^ ]*).*?\)/g) // match all markdown images
            for (const match of matches) {
              images.push(match[1])
            }
          }
        })
      })
    }
    return resolve(images)
  } catch {
    return resolve([])
  }
})