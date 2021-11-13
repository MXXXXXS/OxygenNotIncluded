import { writeFileSync } from "fs"

export const writeJson = (path: string, json: Object) => writeFileSync(path, JSON.stringify(json, null, 2), {
    encoding: 'utf-8',
  })