const getMarkdownFile = async (path: string) => {
  const data = await import(path)
  return await fetch(data).then(res => res.text())
}

export const glossary = async () => [
  {
    name: 'Pipeline',
    alias: [],
    text: await getMarkdownFile('./Pipeline.md')
  }
]
