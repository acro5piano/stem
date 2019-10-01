import * as fs from 'fs'

fs.readFile('./stem.txt', 'utf8', (_, txt) => {
  const lines = txt.split('\n-')
  lines.forEach(line => {
    console.log(extract(line.replace(/\n/g, '')))
  })
})

interface WordDef {
  word: string
  descriptions?: string[]
  refer?: string
}

function extract(line: string): WordDef {
  const wordMatch = line.match(/^(\-?[a-z|\(|\)]+)/)
  if (!wordMatch) {
    console.log(line)
    throw new Error()
  }
  const [word] = wordMatch
  const descriptionMatch = line.match(/(\([a|b|c]\).+)/)
  if (!descriptionMatch) {
    let referMatch = line.match(/(see.+)/)
    if (!referMatch) {
      // TODO
      referMatch = [line]
    }
    const [referRaw] = referMatch
    const refer = referRaw.replace(/ {2,}USAN/, '')
    return {
      word,
      refer,
    }
  }
  const [description] = descriptionMatch
  const descriptions = description
    .replace(/ +/g, ' ')
    .replace(/\(\d+\)/g, '')
    .replace(/INN.+$/g, '')
    .split(/\([a|b|c]\)/g)
    .map(x => x.replace(/(^ | +$)/g, ''))
  return {
    word,
    descriptions,
  }
}
