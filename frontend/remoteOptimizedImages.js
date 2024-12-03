module.exports = new Promise(async (resolve) => {
  const response = await fetch(`http://localhost:1337/api/articles?populate[0]=blocks`);
  const results = (await response.json()).data
  const images = []
  results.forEach(result => {
    result.blocks.forEach(block => {
      if (block.__component === "shared.rich-text") {
        const matches = block.body.match(/!\[.*?\]\((.*?)\)/) // match all markdown images
        if (matches) {
          // grab all the matches except the first and push them into the images array
          matches.slice(1).forEach(match => images.push(match));
        }
      }
    })
  })
  return resolve(images)
})