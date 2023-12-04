import fs from 'fs'
import path from 'path'

import { genDocTemplate } from '../templates/gen-doc'

const DOCS_DIR = path.join(process.cwd(), 'docs')

export const genDoc = (fileName?: string) => {
  // `fileName` can be `undefined` if the user runs the `gen-doc` command without specifying a file name
  if (!fileName) {
    throw new Error('You must include a file name. Example: my-doc.')
  }

  // Throw an error if the file already exists
  if (fs.existsSync(`${DOCS_DIR}/${fileName}.md`)) {
    throw new Error('A file with that name already exists.')
  }

  // Transform `fileName` to a title, with hyphens removed and the first character capitalized
  const title = `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`
    .split('-')
    .join(' ')

  // Create the `docs` folder if it doesn't exist
  if (!fs.existsSync(path.join(process.cwd(), 'docs'))) {
    fs.mkdirSync(path.join(process.cwd(), 'docs'))
  }
  // Create a new doc file
  fs.writeFileSync(`${DOCS_DIR}/${fileName}.md`, genDocTemplate(title))

  console.log(`${fileName}.md created successfully.`)
}
