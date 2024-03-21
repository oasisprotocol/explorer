export abstract class ArrayUtils {
  static replaceOrAppend = <T = unknown>(list: T[], listItem: T, compareFn: (a: T, b: T) => boolean) => {
    const shallowCopy = [...list]
    const i = list.findIndex(v => compareFn(v, listItem))

    if (i === -1) {
      shallowCopy.push(listItem)
    } else {
      shallowCopy.splice(i, 1, listItem)
    }

    return shallowCopy
  }
}
