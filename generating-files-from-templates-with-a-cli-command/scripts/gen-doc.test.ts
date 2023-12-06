import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import fs, { promises as fsPromises } from 'fs'
import { vol } from 'memfs'
import path from 'path'

import { genDoc } from './gen-doc'

const removeWhitespace = (str: string) => str.replace(/\s+/g, ' ')

vi.mock('fs', async () => {
  const memfs: { fs: typeof fs } = await vi.importActual('memfs')

  return {
    default: memfs.fs,
    promises: memfs.fs.promises,
  }
})

describe('genPost', () => {
  const setup = () => {
    // Create a `docs` folder with a `first-doc.md` in the virtual file system
    vol.fromJSON({
      'docs/first-doc.md': 'Hello world',
    })
  }

  beforeEach(() => {
    setup()
  })

  afterEach(() => {
    vol.reset()
  })

  it('should throw an error if file name is not specified', () => {
    try {
      genDoc()
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe(
        'You must include a file name. Example: my-doc.'
      )
    }

    expect.assertions(2)
  })

  it('should throw an error if the file already exists', () => {
    try {
      genDoc('first-doc')
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toBe('A file with that name already exists.')
    }

    expect.assertions(2)
  })

  it('should create a new doc file if the provided file name is valid', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    genDoc('second-doc')

    expect(logSpy).toHaveBeenCalledWith('second-doc.md created successfully.')

    const filePath = path.join(process.cwd(), 'docs/second-doc.md')
    expect(fs.existsSync(filePath)).toBe(true)

    const fileContent = fs.readFileSync(filePath, 'utf-8')

    expect(removeWhitespace(fileContent)).toContain(
      removeWhitespace(
        `# Second doc
        
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
      )
    )
  })
})
