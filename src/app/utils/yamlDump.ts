// eslint-disable-next-line no-restricted-imports
import { dump } from 'js-yaml'

export function yamlDump(obj: any) {
  return dump(obj, {
    replacer: (k, v) => {
      if (v instanceof Map) return Object.fromEntries(v.entries())
      if (typeof v === 'bigint') return v.toString()
      if (typeof v === 'undefined') return '!!undefined'
      return v
    },
  })
}
