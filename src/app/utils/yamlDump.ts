// eslint-disable-next-line no-restricted-imports
import { dump } from 'js-yaml'

export function yamlDump(obj: any) {
  return dump(obj, {
    replacer: (k, v) => {
      return v
    },
  })
}
