import { genDoc } from '../scripts/gen-doc'

// Grab file name from terminal argument
const fileName = process.argv[2]

genDoc(fileName)
