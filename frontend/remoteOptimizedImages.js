module.exports = new Promise(async (resolve) => {
  const response = await fetch(`http://localhost:1337/api/articles?populate[0]=blocks`);
  const results = (await response.json()).data
  const images = []
  results.forEach(result => {
    result.blocks.forEach(block => {
      if (block.__component === "shared.rich-text") {
        const matches = block.body.matchAll(/!\[.*?\]\(([^ ]*).*?\)/g) // match all markdown images
        console.log({matches})
        for (const match of matches) {
          console.log({match})
          images.push(match[1])
        }
      }
    })
  })
  console.log({images})
  return resolve(images)
})